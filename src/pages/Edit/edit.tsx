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

import { ProductImagesProps } from "../../types/products";

export function EditProduct() {
  const { id } = useParams(); // id do produto
  const [imagesProduct, setImagesProduct] = useState<ProductImagesProps[]>([]);
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

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Buscando os dados do produto
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do produto
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id);

        if (error) {
          console.error("Erro ao buscar dados:", error.message);
          return;
        }

        if (data?.length) {
          const product = data[0];

          // Verificando se o usuário autenticado é o dono do produto
          if (product.user_id !== user?.id) {
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
          const selectedCategory = categories.find(
            (category) => category.id === product.category
          );
          setValue(
            "category",
            selectedCategory ? selectedCategory.id : product.category
          );

          // Garantir que o folder_id seja válido
          setFolderId(product.folder_id);

          // Se as imagens estão armazenadas na coluna 'images' como um array de URLs:
          const imageUrls = product.images || []; // A coluna 'images' deve conter URLs

          const imageItems = imageUrls.map((url: string) => ({
            uid: crypto.randomUUID(), // Gerando um ID único para cada imagem
            name: url.split("/").pop() || "", // Pegando o nome do arquivo a partir da URL
            previewUrl: url, // Usando a URL diretamente
            url: url, // URL completa
          }));

          setImagesProduct(imageItems); // Atualiza as imagens do produto no estado

          //retornando as url
          //console.log(imageUrls);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
      }
    };

    fetchData();
  }, [id, user?.id, navigate]);

  // Função para lidar com a seleção de uma categoria
  const handleSelectCategory = (categoryId: number) => {
    //console.log(categoryId);
    setValue("category", categoryId); // Atualiza o valor no formulário
  };

  /* ==============================================*/

  // Função para deletar a imagem ao clicar nela
  const handleDeleteImage = async (image: ProductImagesProps) => {
    // Verificar se ainda há mais de uma imagem
    if (imagesProduct.length <= 1) {
      toast.error("O produto deve ter pelo menos uma imagem.");
      return; // Impede a exclusão se for a última imagem
    }

    // Remover a imagem do estado local
    setImagesProduct((prevImages) =>
      prevImages.filter((item) => item.uid !== image.uid)
    );

    try {
      // 1. Obter a URL pública da imagem
      const { data } = supabase.storage
        .from("imagesProducts")
        .getPublicUrl(`imagesProducts/${user?.id}/${image.uid}`);

      if (!data) {
        throw new Error("Erro ao obter a URL pública da imagem.");
      }

      // 2. Excluir a imagem no Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from("imagesProducts")
        .remove([`imagesProducts/${user?.id}/${folderId}/${image.name}`]); // O caminho precisa ser o mesmo do upload

      if (deleteError) {
        throw new Error(`Erro ao excluir imagem: ${deleteError.message}`);
      }

      // 3. Atualizar o array de URLs no banco de dados (remover a URL da imagem excluída)
      const updatedImages = imagesProduct
        .map((img) => img.url) // Obter todas as URLs
        .filter((url) => url !== data.publicUrl); // Remover a URL da imagem excluída

      // 4. Atualizar a tabela products para remover a URL da imagem
      const { error: updateError } = await supabase
        .from("products")
        .update({ images: updatedImages }) // Atualiza as imagens com o novo array
        .eq("id", id); // Comparando o id para atualizar o produto correto

      if (updateError) {
        throw new Error(
          `Erro ao atualizar as imagens do produto: ${updateError.message}`
        );
      }

      toast.success("Imagem deletada com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro inesperado.");
    }
  };

  /* ==============================================*/

  // Função para realizar o upload e exibir as imagens selecionadas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // Obtendo os arquivos do input

    // Defina o tamanho máximo de arquivo antes de usá-lo
    const MAX_FILE_SIZE_MB = 5;

    // Filtrando arquivos inválidos por tipo
    const invalidFilesByType = files.filter(
      (file) => !["image/jpeg", "image/png"].includes(file.type)
    );

    // Filtrando arquivos inválidos por tamanho
    const invalidFilesBySize = files.filter(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );

    // Verifique os arquivos inválidos
    if (invalidFilesByType.length > 0) {
      toast.error(
        "Algumas imagens têm formato inválido (permitidos: JPEG, PNG)."
      );
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
  const uploadImages = async (
    images: ProductImagesProps[] // Imagens a serem enviadas
  ) => {
    const uploadedImages: ProductImagesProps[] = [];

    // Caminho da pasta do storage
    const folderPath = `imagesProducts/${user?.id}/${folderId}/`;

    for (const image of images) {
      try {
        // Garantindo que o arquivo a ser enviado não seja undefined
        const fileBlob = image.previewUrl
          ? await fetch(image.previewUrl).then((res) => res.blob()) // Pré-visualização
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

        const { error: uploadError } = await supabase.storage
          .from("imagesProducts")
          .upload(uniquePath, fileBlob); // Upload para o caminho único

        if (uploadError) {
          throw new Error(
            `Erro ao fazer upload da imagem: ${uploadError.message}`
          );
        }

        // Obtendo a URL pública da imagem
        const { data } = await supabase.storage
          .from("imagesProducts")
          .getPublicUrl(uniquePath);

        if (!data) {
          throw new Error("Erro ao obter URL pública da imagem.");
        }

        // Armazenando a URL pública da imagem
        uploadedImages.push({
          ...image,
          url: data.publicUrl, // URL pública da imagem
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro inesperado."
        );
        continue; // Continua para o próximo arquivo, mesmo se um falhar
      }
    }

    return uploadedImages;
  };

  /* ======================================================= */

  // Função para enviar o formulário
  // Função para enviar o formulário
  const handleSubmitForm = async (formData: FormData) => {
    try {
      // Primeiro, faça o upload das imagens novas
      const updatedFormData = {
        ...formData, // Mantenha os dados antigos
        id: id, // Atribua o id correto do produto
      };

      // Primeiro, faça o upload das imagens novas
      const uploadedImages = await uploadImages(
        imagesProduct.filter((img) => !img.url) // Apenas imagens novas, sem URL
      );

      // Recupera as imagens existentes do produto
      const existingImages = imagesProduct.map((image) => image.url) || [];

      // Agora, combina as imagens existentes com as novas
      const updatedImages = [
        ...existingImages, // Mantém as imagens existentes
        ...uploadedImages.map((image) => image.url), // Adiciona as URLs das novas imagens
      ].filter(
        (image) => image && typeof image === "string" && image.trim() !== ""
      );

      // Atualiza os dados do produto para incluir as imagens válidas
      const updatedProductData = {
        ...updatedFormData, // Inclui o id correto
        images: updatedImages, // Atualiza o campo 'images' com a lista filtrada de URLs
      };

      // Atualiza o produto no banco de dados
      const { error } = await supabase
        .from("products")
        .update(updatedProductData) // Atualiza o produto com as novas informações
        .eq("id", id); // Comparando o id para atualizar o produto correto

      if (error) {
        console.error("Erro ao atualizar:", error);
        return;
      }

      toast.success("Produto atualizado com sucesso.");
      navigate("/dashboard");
    } catch (erro) {
      toast.error(
        "Erro desconhecido: " +
          (erro instanceof Error ? erro.message : "Erro desconhecido")
      );
      console.error(erro);
    }
  };

  /* ======================================================= */

  return (
    <Container>
      {/* Upload de imagens */}
      <div className={styles.containerUpload}>
        <button className={styles.btnUpload}>
          <div className={styles.containerBtn}>
            <MdDriveFolderUpload size={30} color="#333" />
          </div>
          <div className={styles.uploadImg}>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.inputUpload}
              onChange={handleFileUpload}
            />
          </div>
        </button>

        {/* Exibindo as imagens enviadas */}
        {imagesProduct.map((image) => (
          <div key={image.uid} className={styles.containerImg}>
            <button
              className={styles.btnDelete}
              onClick={() => handleDeleteImage(image)} // Chamando a função para deletar a imagem
            >
              <MdOutlineDeleteForever size={28} color="#fff" />
            </button>
            <img
              className={styles.imgPreview}
              src={image.previewUrl}
              alt={`Foto do produto`}
            />
          </div>
        ))}
      </div>

      {/* Formulário principal */}
      <main className={styles.principal}>
        <form
          className={styles.formulario}
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          {/* Nome do produto */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Produto</p>
            <div className={styles.input}>
              <Input
                type="text"
                register={register}
                name="name"
                placeholder="Nome do produto"
              />
            </div>
            {errors.name && (
              <p className={styles.descriptionAlert}>{errors.name?.message}</p>
            )}
          </div>

          {/* Preço do produto */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Valor</p>
            <div className={styles.input}>
              <Input
                type="text"
                register={register}
                name="price"
                placeholder="Ex: 10.598,50 ou 1.000,00 ou 100,00 ou 1,99"
              />
            </div>
            {errors.price && (
              <p className={styles.descriptionAlert}>{errors.price?.message}</p>
            )}
          </div>

          {/* Descrição do produto */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Subtítulo</p>
            <div className={styles.input}>
              <Input
                type="text"
                register={register}
                name="description"
                placeholder="Uma pequena descrição para chamar atenção na página inicial"
              />
            </div>
            {errors.description && (
              <p className={styles.descriptionAlert}>
                {errors.description?.message}
              </p>
            )}
          </div>

          {/* Cidade */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Cidade</p>
            <div className={styles.input}>
              <Input
                type="text"
                register={register}
                name="city"
                placeholder="Cidade onde o produto se encontra"
              />
            </div>
            {errors.city && (
              <p className={styles.descriptionAlert}>{errors.city?.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Categoria</p>
            <CustomSelect
              onSelect={handleSelectCategory}
              value={watch("category")}
              categories={categories}
            />
            {errors.category && (
              <p className={styles.descriptionAlert}>
                {errors.category?.message}
              </p>
            )}
          </div>

          {/* Descrição completa */}
          <div className={styles.divisaoLabel}>
            <p className={styles.label}>Descrição Completa</p>
            <textarea
              className={styles.full_description}
              {...register("full_description")}
              name="full_description"
              id="full_description"
              placeholder="Informe a descrição completa do produto"
            ></textarea>
            {errors.full_description && (
              <p className={styles.descriptionAlert}>
                {errors.full_description?.message}
              </p>
            )}
          </div>

          {/* Botão de envio */}
          <button type="submit" className={styles.btnCadastrar}>
            Atualizar
          </button>
        </form>
      </main>
    </Container>
  );
}
