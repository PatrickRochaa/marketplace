var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./edit.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdDriveFolderUpload, MdOutlineDeleteForever } from "react-icons/md";
import { CustomSelect } from "../../components/CustomSelect/customSelect";
import { Input } from "../../components/Input/input";
import { Container } from "../../components/Container/container";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// Importando o cliente do Supabase
import { supabase } from "../../services/supabaseClient"; // ajuste o caminho conforme necessário
import { useAuth } from "../../context/AuthContext";
export function EditProduct() {
    var _a, _b, _c, _d, _e, _f;
    const { id } = useParams(); // id do produto
    const [imagesProduct, setImagesProduct] = useState([]);
    const [folderId, setFolderId] = useState(null); // Estado para armazenar o folderId
    const { user } = useAuth(); // Aqui você usa o hook useAuth
    const navigate = useNavigate();
    // Definindo as categorias estáticas
    const categories = [
        { id: 1, name: "Eletrônicos" },
        { id: 2, name: "Roupas" },
        { id: 3, name: "Casa e Jardim" },
        { id: 4, name: "Esportes" },
    ];
    const schema = z.object({
        name: z.string().min(1, "O nome do produto é obrigatório"),
        price: z
            .string()
            .min(1, "O campo preço é obrigatório")
            .regex(/^\d+(\.\d{1,2})?$/, "Preço inválido, insira um número válido"),
        city: z.string().min(1, "O campo cidade é obrigatório"),
        description: z.string().min(1, "O campo descrição é obrigatório"),
        full_description: z.string().min(1, "A descrição completa é obrigatória"),
        category: z.number().min(1, "Selecione uma categoria válida."),
    });
    const { register, handleSubmit, formState: { errors }, setValue, watch, } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    // Buscando os dados do produto
    useEffect(() => {
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar dados do produto
                const { data, error } = yield supabase
                    .from("products")
                    .select("*")
                    .eq("id", id);
                if (error) {
                    console.error("Erro ao buscar dados:", error.message);
                    return;
                }
                if (data === null || data === void 0 ? void 0 : data.length) {
                    const product = data[0];
                    // Verificando se o usuário autenticado é o dono do produto
                    if (product.user_id !== (user === null || user === void 0 ? void 0 : user.id)) {
                        toast.error("Você não tem permissão para editar este produto.");
                        navigate("/"); // Redireciona o usuário para a página inicial
                        return;
                    }
                    setValue("name", product.name);
                    setValue("price", product.price);
                    setValue("description", product.description);
                    setValue("full_description", product.full_description);
                    setValue("city", product.city);
                    // Aqui você preenche a categoria selecionada corretamente
                    const selectedCategory = categories.find((category) => category.id === product.category);
                    setValue("category", selectedCategory ? selectedCategory.id : product.category);
                    // Garantir que o folder_id seja válido
                    setFolderId(product.folder_id);
                    // Se as imagens estão armazenadas na coluna 'images' como um array de URLs:
                    const imageUrls = product.images || []; // A coluna 'images' deve conter URLs
                    const imageItems = imageUrls.map((url) => ({
                        uid: crypto.randomUUID(), // Gerando um ID único para cada imagem
                        name: url.split("/").pop() || "", // Pegando o nome do arquivo a partir da URL
                        previewUrl: url, // Usando a URL diretamente
                        url: url, // URL completa
                    }));
                    setImagesProduct(imageItems); // Atualiza as imagens do produto no estado
                    //retornando as url
                    //console.log(imageUrls);
                }
            }
            catch (err) {
                console.error("Erro inesperado:", err);
            }
        });
        fetchData();
    }, [id, user === null || user === void 0 ? void 0 : user.id, navigate]);
    // Função para lidar com a seleção de uma categoria
    const handleSelectCategory = (categoryId) => {
        //console.log(categoryId);
        setValue("category", categoryId); // Atualiza o valor no formulário
    };
    /* ==============================================*/
    // Função para deletar a imagem ao clicar nela
    const handleDeleteImage = (image) => __awaiter(this, void 0, void 0, function* () {
        // Verificar se ainda há mais de uma imagem
        if (imagesProduct.length <= 1) {
            toast.error("O produto deve ter pelo menos uma imagem.");
            return; // Impede a exclusão se for a última imagem
        }
        // Remover a imagem do estado local
        setImagesProduct((prevImages) => prevImages.filter((item) => item.uid !== image.uid));
        try {
            // 1. Obter a URL pública da imagem
            const { data } = supabase.storage
                .from("imagesProducts")
                .getPublicUrl(`imagesProducts/${user === null || user === void 0 ? void 0 : user.id}/${image.uid}`);
            if (!data) {
                throw new Error("Erro ao obter a URL pública da imagem.");
            }
            // 2. Excluir a imagem no Supabase Storage
            const { error: deleteError } = yield supabase.storage
                .from("imagesProducts")
                .remove([`imagesProducts/${user === null || user === void 0 ? void 0 : user.id}/${folderId}/${image.name}`]); // O caminho precisa ser o mesmo do upload
            if (deleteError) {
                throw new Error(`Erro ao excluir imagem: ${deleteError.message}`);
            }
            // 3. Atualizar o array de URLs no banco de dados (remover a URL da imagem excluída)
            const updatedImages = imagesProduct
                .map((img) => img.url) // Obter todas as URLs
                .filter((url) => url !== data.publicUrl); // Remover a URL da imagem excluída
            // 4. Atualizar a tabela products para remover a URL da imagem
            const { error: updateError } = yield supabase
                .from("products")
                .update({ images: updatedImages }) // Atualiza as imagens com o novo array
                .eq("id", id); // Comparando o id para atualizar o produto correto
            if (updateError) {
                throw new Error(`Erro ao atualizar as imagens do produto: ${updateError.message}`);
            }
            toast.success("Imagem deletada com sucesso.");
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro inesperado.");
        }
    });
    /* ==============================================*/
    // Função para realizar o upload e exibir as imagens selecionadas
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []); // Obtendo os arquivos do input
        // Defina o tamanho máximo de arquivo antes de usá-lo
        const MAX_FILE_SIZE_MB = 5;
        // Filtrando arquivos inválidos por tipo
        const invalidFilesByType = files.filter((file) => !["image/jpeg", "image/png"].includes(file.type));
        // Filtrando arquivos inválidos por tamanho
        const invalidFilesBySize = files.filter((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
        // Verifique os arquivos inválidos
        if (invalidFilesByType.length > 0) {
            toast.error("Algumas imagens têm formato inválido (permitidos: JPEG, PNG).");
            return;
        }
        if (invalidFilesBySize.length > 0) {
            toast.error("Algumas imagens excedem o tamanho permitido (máximo: 5MB).");
            return;
        }
        // Gerando informações para cada imagem válida
        const newImages = files.map((file) => ({
            uid: crypto.randomUUID(), // Gerando um ID único para cada imagem
            name: file.name, // Nome do arquivo
            previewUrl: URL.createObjectURL(file), // URL para pré-visualização
            url: "", // Será preenchido após o upload no Supabase
            src: [], // Adicionando a propriedade 'src' como um array vazio inicialmente
        }));
        // Atualizando o estado com as novas imagens
        setImagesProduct((prev) => [...prev, ...newImages]);
    };
    /* ======================================================= */
    // Função para fazer o upload das imagens no Supabase e adicionar as novas imagens
    const uploadImages = (images // Imagens a serem enviadas
    ) => __awaiter(this, void 0, void 0, function* () {
        const uploadedImages = [];
        // Caminho da pasta do storage
        const folderPath = `imagesProducts/${user === null || user === void 0 ? void 0 : user.id}/${folderId}/`;
        for (const image of images) {
            try {
                // Garantindo que o arquivo a ser enviado não seja undefined
                const fileBlob = image.previewUrl
                    ? yield fetch(image.previewUrl).then((res) => res.blob()) // Pré-visualização
                    : image.file; // Se não, usa o arquivo diretamente
                if (!fileBlob) {
                    throw new Error("Erro: A imagem não é válida (undefined).");
                }
                const imageName = `${image.uid}-${image.name}`;
                if (!imageName) {
                    throw new Error("Nome ou UID da imagem não encontrado.");
                }
                // Caminho único para o arquivo
                const uniquePath = `${folderPath}/${image.uid}${image.name}`;
                const { error: uploadError } = yield supabase.storage
                    .from("imagesProducts")
                    .upload(uniquePath, fileBlob); // Upload para o caminho único
                if (uploadError) {
                    throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
                }
                // Obtendo a URL pública da imagem
                const { data } = yield supabase.storage
                    .from("imagesProducts")
                    .getPublicUrl(uniquePath);
                if (!data) {
                    throw new Error("Erro ao obter URL pública da imagem.");
                }
                // Armazenando a URL pública da imagem
                uploadedImages.push(Object.assign(Object.assign({}, image), { url: data.publicUrl }));
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro inesperado.");
                continue; // Continua para o próximo arquivo, mesmo se um falhar
            }
        }
        return uploadedImages;
    });
    /* ======================================================= */
    // Função para enviar o formulário
    // Função para enviar o formulário
    const handleSubmitForm = (formData) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Primeiro, faça o upload das imagens novas
            const updatedFormData = Object.assign(Object.assign({}, formData), { id: id });
            // Primeiro, faça o upload das imagens novas
            const uploadedImages = yield uploadImages(imagesProduct.filter((img) => !img.url) // Apenas imagens novas, sem URL
            );
            // Recupera as imagens existentes do produto
            const existingImages = imagesProduct.map((image) => image.url) || [];
            // Agora, combina as imagens existentes com as novas
            const updatedImages = [
                ...existingImages, // Mantém as imagens existentes
                ...uploadedImages.map((image) => image.url), // Adiciona as URLs das novas imagens
            ].filter((image) => image && typeof image === "string" && image.trim() !== "");
            // Atualiza os dados do produto para incluir as imagens válidas
            const updatedProductData = Object.assign(Object.assign({}, updatedFormData), { images: updatedImages });
            // Atualiza o produto no banco de dados
            const { error } = yield supabase
                .from("products")
                .update(updatedProductData) // Atualiza o produto com as novas informações
                .eq("id", id); // Comparando o id para atualizar o produto correto
            if (error) {
                console.error("Erro ao atualizar:", error);
                return;
            }
            toast.success("Produto atualizado com sucesso.");
            navigate("/dashboard");
        }
        catch (erro) {
            toast.error("Erro desconhecido: " +
                (erro instanceof Error ? erro.message : "Erro desconhecido"));
            console.error(erro);
        }
    });
    /* ======================================================= */
    return (_jsxs(Container, { children: [_jsxs("div", { className: styles.containerUpload, children: [_jsxs("button", { className: styles.btnUpload, children: [_jsx("div", { className: styles.containerBtn, children: _jsx(MdDriveFolderUpload, { size: 30, color: "#333" }) }), _jsx("div", { className: styles.uploadImg, children: _jsx("input", { type: "file", accept: "image/*", multiple: true, className: styles.inputUpload, onChange: handleFileUpload }) })] }), imagesProduct.map((image) => (_jsxs("div", { className: styles.containerImg, children: [_jsx("button", { className: styles.btnDelete, onClick: () => handleDeleteImage(image), children: _jsx(MdOutlineDeleteForever, { size: 28, color: "#fff" }) }), _jsx("img", { className: styles.imgPreview, src: image.previewUrl, alt: `Foto do produto` })] }, image.uid)))] }), _jsx("main", { className: styles.principal, children: _jsxs("form", { className: styles.formulario, onSubmit: handleSubmit(handleSubmitForm), children: [_jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Produto" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "name", placeholder: "Nome do produto" }) }), errors.name && (_jsx("p", { className: styles.descriptionAlert, children: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Valor" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "price", placeholder: "Ex: 10.598,50 ou 1.000,00 ou 100,00 ou 1,99" }) }), errors.price && (_jsx("p", { className: styles.descriptionAlert, children: (_b = errors.price) === null || _b === void 0 ? void 0 : _b.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Subt\u00EDtulo" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "description", placeholder: "Uma pequena descri\u00E7\u00E3o para chamar aten\u00E7\u00E3o na p\u00E1gina inicial" }) }), errors.description && (_jsx("p", { className: styles.descriptionAlert, children: (_c = errors.description) === null || _c === void 0 ? void 0 : _c.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Cidade" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "city", placeholder: "Cidade onde o produto se encontra" }) }), errors.city && (_jsx("p", { className: styles.descriptionAlert, children: (_d = errors.city) === null || _d === void 0 ? void 0 : _d.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Categoria" }), _jsx(CustomSelect, { onSelect: handleSelectCategory, value: watch("category"), categories: categories }), errors.category && (_jsx("p", { className: styles.descriptionAlert, children: (_e = errors.category) === null || _e === void 0 ? void 0 : _e.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Descri\u00E7\u00E3o Completa" }), _jsx("textarea", Object.assign({ className: styles.full_description }, register("full_description"), { name: "full_description", id: "full_description", placeholder: "Informe a descri\u00E7\u00E3o completa do produto" })), errors.full_description && (_jsx("p", { className: styles.descriptionAlert, children: (_f = errors.full_description) === null || _f === void 0 ? void 0 : _f.message }))] }), _jsx("button", { type: "submit", className: styles.btnCadastrar, children: "Atualizar" })] }) })] }));
}
