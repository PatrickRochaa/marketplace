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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./newProduct.module.css";
import { CustomSelect } from "../../../components/CustomSelect/customSelect";
import { Container } from "../../../components/Container/container";
import { Input } from "../../../components/Input/input";
import { MdDriveFolderUpload, MdOutlineDeleteForever } from "react-icons/md";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supabaseClient"; // Importação do cliente Supabase
import { useAuth } from "../../../context/AuthContext"; // Importe o hook useAuth
export function NewProduct() {
    var _a, _b, _c, _d, _e, _f;
    const [imagesProduct, setImagesProduct] = useState([]); // Estado que mantém as imagens do produto
    const navigate = useNavigate(); // Função para navegação entre páginas
    // Utilize o hook useAuth para acessar o usuário logado
    const { user } = useAuth(); // Obtém o usuário do contexto AuthContext
    const [selectedCategory, setSelectedCategory] = useState(0); // Estado para controlar a categoria selecionada
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
    const { register, handleSubmit, formState: { errors }, reset, setValue, } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            category: 0, // Inicializando com 0
        },
    });
    /* ============================================================== */
    // Função para lidar com a seleção de uma categoria
    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId); // Atualiza o estado com o ID da categoria selecionada
        // console.log("Categoria ID selecionada:", typeof categoryId); // Exibe o ID da categoria no console
        // console.log("Categoria Nome:", selectedCategoryName); // Exibe o nome da categoria no console
        setSelectedCategory(categoryId);
        setValue("category", categoryId); // Atualiza o valor no formulário
    };
    /* ==============================================*/
    const handleDeleteImage = (image) => {
        setImagesProduct((prevImages) => prevImages.filter((item) => item.uid !== image.uid));
    };
    /* ==============================================*/
    // Função para realizar o upload das imagens selecionadas
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
        }));
        // Atualizando o estado com as novas imagens
        setImagesProduct((prev) => [...prev, ...newImages]);
    };
    /* ==============================================*/
    // Função para fazer o upload das imagens no Supabase
    const uploadImages = (images, // Lista de imagens a serem enviadas
    productId // ID do produto
    ) => __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            toast.error("Usuário não está logado."); // Verifica se o usuário está logado
            return [];
        }
        const uploadedImages = [];
        const folderId = `imagesProducts/${user.id}/${productId}`; // Caminho único para a pasta do usuário e produto
        for (const image of images) {
            try {
                const uniquePath = `${folderId}/${image.uid}-${image.name}`; // Caminho único para a imagem
                // Convertendo a URL de pré-visualização em um blob
                const fileBlob = yield fetch(image.previewUrl).then((res) => res.blob());
                // Fazendo upload da imagem no Supabase
                const { error: uploadError } = yield supabase.storage
                    .from("imagesProducts")
                    .upload(uniquePath, fileBlob);
                if (uploadError) {
                    throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
                }
                // Obtendo a URL pública da imagem
                const { data } = supabase.storage
                    .from("imagesProducts")
                    .getPublicUrl(uniquePath);
                if (!data) {
                    throw new Error("Erro ao obter URL pública.");
                }
                // Adicionando a imagem com a URL pública à lista de imagens enviadas
                uploadedImages.push(Object.assign(Object.assign({}, image), { url: (data === null || data === void 0 ? void 0 : data.publicUrl) || "" }));
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro inesperado.");
                console.error(error);
                continue; // Continua o loop mesmo se uma imagem falhar
            }
        }
        return uploadedImages; // Retorna as imagens com URLs públicas
    });
    /* ==============================================*/
    /*CadastrandoProdutos*/
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        //console.log("Dados do formulário:", data);
        const price = parseFloat(data.price.replace(",", "."));
        if (isNaN(price)) {
            toast.error("Preço inválido.");
            return;
        }
        if (imagesProduct.length === 0) {
            toast.error("É necessário adicionar ao menos uma imagem ao produto.");
            return;
        }
        if (!user) {
            toast.error("Você precisa estar logado para cadastrar um produto.");
            return;
        }
        const productId = crypto.randomUUID();
        const uploadedImages = yield uploadImages(imagesProduct, productId);
        if (uploadedImages.length === 0) {
            toast.error("Erro ao fazer upload das imagens.");
            return;
        }
        // Verificando a categoria antes de enviar
        //console.log("Categoria selecionada:", data.category); // Verifique se isso é um número
        const { error } = yield supabase.from("products").insert([
            {
                name: data.name,
                price: price,
                city: data.city,
                description: data.description,
                full_description: data.full_description,
                category: data.category, // Garantindo que seja um número
                user_id: user.id,
                images: uploadedImages.map((img) => img.url),
                folder_id: `${productId}`,
            },
        ]);
        if (error) {
            toast.error("Erro ao cadastrar o produto.");
        }
        else {
            toast.success("Produto cadastrado com sucesso!");
            setTimeout(() => {
                reset({
                    name: "",
                    price: "",
                    city: "",
                    description: "",
                    full_description: "",
                    category: 0,
                });
                setImagesProduct([]);
                navigate("/dashboard");
            }, 1000);
        }
    });
    /* ==============================================*/
    return (_jsxs(Container, { children: [_jsxs("div", { className: styles.containerUpload, children: [_jsxs("button", { className: styles.btnUpload, children: [_jsx("div", { className: styles.containerBtn, children: _jsx(MdDriveFolderUpload, { size: 30, color: "#333" }) }), _jsx("div", { className: styles.uploadImg, children: _jsx("input", { type: "file", accept: "image/*", multiple: true, className: styles.inputUpload, onChange: handleFileUpload }) })] }), imagesProduct.map((item) => (_jsxs("div", { className: styles.containerImg, children: [_jsx("button", { className: styles.btnDelete, onClick: () => handleDeleteImage(item), children: _jsx(MdOutlineDeleteForever, { size: 28, color: "#fff" }) }), _jsx("img", { className: styles.imgPreview, src: item.previewUrl, alt: `Foto do produto ${item.name}` })] }, item.uid)))] }), _jsx("main", { className: styles.principal, children: _jsxs("form", { className: styles.formulario, onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Produto" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "name", placeholder: "Nome do produto" }) }), errors.name && (_jsx("p", { className: styles.descriptionAlert, children: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Valor" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "price", placeholder: "Ex: 10.598,50 ou 1.000,00 ou 100,00 ou 1,99" }) }), errors.price && (_jsx("p", { className: styles.descriptionAlert, children: (_b = errors.price) === null || _b === void 0 ? void 0 : _b.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Subt\u00EDtulo" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "description", placeholder: "Uma pequena descri\u00E7\u00E3o para chamar aten\u00E7\u00E3o na p\u00E1gina inicial" }) }), errors.description && (_jsx("p", { className: styles.descriptionAlert, children: (_c = errors.description) === null || _c === void 0 ? void 0 : _c.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Cidade" }), _jsx("div", { className: styles.input, children: _jsx(Input, { type: "text", register: register, name: "city", placeholder: "Cidade onde o produto se encontra" }) }), errors.city && (_jsx("p", { className: styles.descriptionAlert, children: (_d = errors.city) === null || _d === void 0 ? void 0 : _d.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Categoria" }), _jsx(CustomSelect, { value: selectedCategory, onSelect: handleSelectCategory, categories: categories }), errors.category && (_jsx("p", { className: styles.descriptionAlert, children: (_e = errors.category) === null || _e === void 0 ? void 0 : _e.message }))] }), _jsxs("div", { className: styles.divisaoLabel, children: [_jsx("p", { className: styles.label, children: "Descri\u00E7\u00E3o Completa" }), _jsx("textarea", Object.assign({ className: styles.full_description }, register("full_description"), { name: "full_description", id: "full_description", placeholder: "Informe a descri\u00E7\u00E3o completa do produto" })), errors.full_description && (_jsx("p", { className: styles.descriptionAlert, children: (_f = errors.full_description) === null || _f === void 0 ? void 0 : _f.message }))] }), _jsx("button", { type: "submit", className: styles.btnCadastrar, children: "Cadastrar" })] }) })] }));
}
