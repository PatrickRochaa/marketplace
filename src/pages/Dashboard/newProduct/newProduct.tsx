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

import { ProductImagesProps } from "../../../types/products";

export function NewProduct() {
  const [imagesProduct, setImagesProduct] = useState<ProductImagesProps[]>([]); // Estado que mantém as imagens do produto
  const navigate = useNavigate(); // Função para navegação entre páginas

  // Utilize o hook useAuth para acessar o usuário logado
  const { user } = useAuth(); // Obtém o usuário do contexto AuthContext

  const [selectedCategory, setSelectedCategory] = useState<number>(0); // Estado para controlar a categoria selecionada

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

  type FormData = z.infer<typeof schema>; // Inferindo o tipo de dados do formulário com base no esquema de validação

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      category: 0, // Inicializando com 0
    },
  });

  /* ============================================================== */

  // Função para lidar com a seleção de uma categoria
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategory(categoryId); // Atualiza o estado com o ID da categoria selecionada
    // console.log("Categoria ID selecionada:", typeof categoryId); // Exibe o ID da categoria no console

    // console.log("Categoria Nome:", selectedCategoryName); // Exibe o nome da categoria no console
    setSelectedCategory(categoryId);
    setValue("category", categoryId); // Atualiza o valor no formulário
  };

  /* ==============================================*/

  const handleDeleteImage = (image: ProductImagesProps) => {
    setImagesProduct((prevImages) =>
      prevImages.filter((item) => item.uid !== image.uid)
    );
  };

  /* ==============================================*/

  // Função para realizar o upload das imagens selecionadas
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
    }));

    // Atualizando o estado com as novas imagens
    setImagesProduct((prev) => [...prev, ...newImages] as ProductImagesProps[]);
  };

  /* ==============================================*/

  // Função para fazer o upload das imagens no Supabase
  const uploadImages = async (
    images: ProductImagesProps[], // Lista de imagens a serem enviadas
    productId: string // ID do produto
  ) => {
    if (!user) {
      toast.error("Usuário não está logado."); // Verifica se o usuário está logado
      return [];
    }

    const uploadedImages: ProductImagesProps[] = [];
    const folderId = `imagesProducts/${user.id}/${productId}`; // Caminho único para a pasta do usuário e produto

    for (const image of images) {
      try {
        const uniquePath = `${folderId}/${image.uid}-${image.name}`; // Caminho único para a imagem

        // Convertendo a URL de pré-visualização em um blob
        const fileBlob = await fetch(image.previewUrl).then((res) =>
          res.blob()
        );

        // Fazendo upload da imagem no Supabase
        const { error: uploadError } = await supabase.storage
          .from("imagesProducts")
          .upload(uniquePath, fileBlob);

        if (uploadError) {
          throw new Error(
            `Erro ao fazer upload da imagem: ${uploadError.message}`
          );
        }

        // Obtendo a URL pública da imagem
        const { data } = supabase.storage
          .from("imagesProducts")
          .getPublicUrl(uniquePath);

        if (!data) {
          throw new Error("Erro ao obter URL pública.");
        }

        // Adicionando a imagem com a URL pública à lista de imagens enviadas
        uploadedImages.push({
          ...image,
          url: data?.publicUrl || "",
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro inesperado."
        );
        console.error(error);
        continue; // Continua o loop mesmo se uma imagem falhar
      }
    }

    return uploadedImages; // Retorna as imagens com URLs públicas
  };

  /* ==============================================*/

  /*CadastrandoProdutos*/
  const onSubmit = async (data: FormData) => {
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

    const uploadedImages = await uploadImages(imagesProduct, productId);
    if (uploadedImages.length === 0) {
      toast.error("Erro ao fazer upload das imagens.");
      return;
    }

    // Verificando a categoria antes de enviar
    //console.log("Categoria selecionada:", data.category); // Verifique se isso é um número

    const { error } = await supabase.from("products").insert([
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
    } else {
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
  };

  /* ==============================================*/

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

        {/*Exibindo as imagem enviadas*/}
        {imagesProduct.map((item) => (
          <div key={item.uid} className={styles.containerImg}>
            <button
              className={styles.btnDelete}
              onClick={() => handleDeleteImage(item)}
            >
              <MdOutlineDeleteForever size={28} color="#fff" />
            </button>
            <img
              className={styles.imgPreview}
              src={item.previewUrl}
              alt={`Foto do produto ${item.name}`}
            />
          </div>
        ))}
      </div>

      {/* Formulário principal */}
      <main className={styles.principal}>
        <form className={styles.formulario} onSubmit={handleSubmit(onSubmit)}>
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
              value={selectedCategory}
              onSelect={handleSelectCategory} // Passando a função para o onSelect
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
            Cadastrar
          </button>
        </form>
      </main>
    </Container>
  );
}
