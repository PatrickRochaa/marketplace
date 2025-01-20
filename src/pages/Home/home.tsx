import styles from "./home.module.css"; //css geral
import modalStyles from "./modal.module.css"; //modal do detalhes
import cartModal from "./cartModal.module.css"; //ccs do modal do carrinho
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; //link navegaçao

import { Container } from "../../components/Container/container"; //container geral
import { FallbackImage } from "../../components/FallbackImage/FallbackImage"; //erro caso nao tenha imagem
import { CustomSelect } from "../../components/CustomSelect/customSelect"; //filtro dos produtos

import { Swiper, SwiperSlide } from "swiper/react"; //slider

import { supabase } from "../../services/supabaseClient"; //conexao com supabase
import { ProductProps } from "../../types/products"; // interface produtos

// icone botao carrinho
import { BsCartCheck } from "react-icons/bs";

import { useAuth } from "../../context/AuthContext"; //contexto do usuario
import { useCart } from "../../context/CartContext"; //contexto do carrinho

import { Skeleton } from "../../components/SkeletonProdutos/skeletonProdutos";

import { Propaganda } from "../../components/Propaganda/propaganda";

export function Home() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState<ProductProps | null>(null);

  // modal detalhes
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  //pegando usuario
  const { signed } = useAuth();

  //context do carrinho de compras
  const { addToCart, cartItems, updateQuantity, tempCart } = useCart();

  //modal carrinho
  const [isModalCart, setIsModalCart] = useState(false);

  //pesquisa
  const [searchTerm, setSearchTerm] = useState<string>("");

  //controla a exibiçao do botao do carrinho
  const [showCartButton, setShowCartButton] = useState(false);

  // Controle de exibição
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  const categories = [
    { id: 1, name: "Eletrônicos" },
    { id: 2, name: "Roupas" },
    { id: 3, name: "Casa e Jardim" },
    { id: 4, name: "Esportes" },
  ];

  /* =============================================================== */

  // Carregar produtos do Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }); // Ordena pela coluna created_at de forma descendente

        if (error) throw new Error(error.message);

        setProducts(data || []);
        setFilteredProducts(data || []); // Inicializa a exibição com todos os produtos
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* =============================================================== */

  //Adicionando ao carrinho
  const handleAddToCart = (product: ProductProps) => {
    addToCart(product); // Usando a função do contexto para adicionar ao carrinho
    setIsModalOpen(true);
  };

  /* =============================================================== */

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowCartButton(true); // Exibe o botão quando rolar mais de 300px
      } else {
        setShowCartButton(false); // Oculta o botão quando rolar para cima
      }
    };

    // Adiciona o ouvinte de evento de rolagem
    window.addEventListener("scroll", handleScroll);

    // Remove o ouvinte quando o componente for desmontado
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =============================================================== */

  // Filtrar produtos com base na categoria selecionada e na pesquisa
  useEffect(() => {
    const filteredByCategoryAndSearch = products.filter((product) => {
      // Filtra pelos produtos da categoria selecionada
      const categoryMatch = selectedCategory
        ? Number(product.category) === Number(selectedCategory)
        : true;

      // Filtra pelo nome do produto com base no searchTerm
      const searchMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });

    setFilteredProducts(filteredByCategoryAndSearch);
  }, [selectedCategory, products, searchTerm]);
  /* =============================================================== */

  // Função para lidar com a seleção de uma categoria
  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategory(categoryId); // Atualiza a categoria selecionada
  };

  /* =============================================================== */

  /*Modal de detalhes */

  const openModal = (product: ProductProps) => {
    setModalProduct(product);
    setIsModalOpen(true);
    document.body.classList.add("modalOpen");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProduct(null);
    document.body.classList.remove("modalOpen");
  };

  /* =============================================================== */

  {
    /*Modal Carrinho  */
  }
  const openModalCart = () => {
    setIsModalCart(true); // Modificado para definir como true para abrir o modal
    document.body.classList.add("modalOpen");

    //console.log(tempCart);
  };

  const closeModalCart = () => {
    setIsModalCart(false); // Modificado para fechar o modal
    document.body.classList.remove("modalOpen");
  };

  /* =============================================================== */

  return (
    <Container>
      <div className={styles.propaganda}>
        <Propaganda />
      </div>
      <h1 className={styles.tituloTopo}>Marketplace Fake</h1>
      {/* Cabeçalho */}
      <header className={styles.header}>
        {/* Barra de pesquisa */}
        <form className={styles.search_form}>
          <input
            type="text"
            placeholder="Pesquise produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.search_input}
          />
        </form>
        {/* Botao filtragem */}
        <CustomSelect
          value={selectedCategory}
          onSelect={handleSelectCategory} // Usando a função criada
          categories={categories.map((category) => ({
            ...category,
            id: Number(category.id),
          }))}
        />
      </header>

      {/* Subtítulo */}
      <h2 className={styles.subTitulo}>O produto dos seus sonhos está aqui!</h2>

      {loading ? (
        <section className={styles.products_container}>
          {/*Skekeleton enquanto os dados são carregados */}
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </section>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.alertMessage}>
          {/*Mensagem caso de erro nao caso nao tenha produto cadastrado*/}
          <h2 className={styles.alertInformation}>Ops!</h2>
          <h2 className={styles.alertInformation}>
            Nenhum produto encontrado.
          </h2>
        </div>
      ) : (
        <section className={styles.products_container}>
          {/*exibiçao dos produtos cadastrador*/}
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.product_card}>
              <div
                className={styles.linkDetail}
                onClick={() => openModal(product)}
              >
                <FallbackImage
                  src={String(product.images[0])}
                  alt={product.name}
                  errorMessage="Imagem indisponível."
                />
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <p className={styles.price}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </p>
              </div>
              <button
                className={styles.btnCompra}
                onClick={() => handleAddToCart(product)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </section>
      )}
      {/*Modal dos detalhes*/}
      {isModalOpen && modalProduct && (
        <div
          className={`${modalStyles.modalOverlay} ${
            isModalOpen ? modalStyles.open : ""
          }`}
        >
          <div className={modalStyles.modalContent}>
            <button className={modalStyles.closeBtn} onClick={closeModal}>
              X
            </button>
            <div className={modalStyles.imageContainer}>
              <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                className={modalStyles.swiper}
              >
                {modalProduct.images.map((imageUrl, imageIndex) => (
                  <SwiperSlide key={`${modalProduct.id}-${imageIndex}`}>
                    <img
                      src={String(imageUrl)}
                      className={modalStyles.image}
                      alt={`foto do produto ${modalProduct.name}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className={modalStyles.detailsContainer}>
              <h3 className={modalStyles.name}>{modalProduct.name}</h3>
              <p
                className={modalStyles.description}
                onClick={toggleDescription} // Faz com que a descrição seja alternada ao clicar
              >
                {isDescriptionOpen
                  ? modalProduct.full_description
                  : `${modalProduct.full_description.slice(0, 100)}...`}
              </p>

              <p className={modalStyles.price}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(modalProduct.price)}
              </p>
              <button
                className={modalStyles.btnCompra}
                onClick={() => handleAddToCart(modalProduct)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Botão para abrir o modal do carrinho*/}
      <button
        className={`${cartModal.btnCart} ${
          showCartButton ? cartModal.visible : ""
        }`}
        onClick={openModalCart}
      >
        <BsCartCheck size={30} color="#fff" />
        {(signed ? cartItems : tempCart).length > 0 && (
          <span className={cartModal.cartCount}>
            {(signed ? cartItems : tempCart).length}
          </span>
        )}
      </button>

      {isModalCart && (
        <div className={cartModal.containerCartModal}>
          <div className={cartModal.CartModal}>
            <h3 className={cartModal.tituloCart}>Resumo Carrinho</h3>

            {/* Se o carrinho tiver itens e o usuário estiver logado (usando cartItems) */}
            {signed && cartItems.length > 0 && (
              <div className={cartModal.productSummary}>
                <div className={cartModal.productHeader}>
                  <span className={cartModal.productName}>Nome</span>
                  <span className={cartModal.productQuantity}>Quantidade</span>
                  <span className={cartModal.productSubtotal}>Subtotal</span>
                </div>

                {cartItems.map(({ id, name, price, quantity }) => (
                  <div className={cartModal.productItem} key={id}>
                    <span className={cartModal.productName}>{name}</span>
                    <div className={cartModal.quantityControls}>
                      {/* Botão de decremento */}
                      <button onClick={() => updateQuantity(id, quantity - 1)}>
                        -
                      </button>
                      <span>{quantity}</span>
                      {/* Botão de incremento */}
                      <button onClick={() => updateQuantity(id, quantity + 1)}>
                        +
                      </button>
                    </div>
                    <span className={cartModal.productSubtotal}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Se cartItems estiver vazio e o usuário estiver logado */}
            {signed && cartItems.length === 0 && (
              <p className={cartModal.message}>O carrinho está vazio.</p>
            )}

            {/* Se tempCart estiver com itens e o usuário não estiver logado */}
            {!signed && tempCart.length > 0 && (
              <div className={cartModal.productSummary}>
                <div className={cartModal.productHeader}>
                  <span className={cartModal.productName}>Nome</span>
                  <span className={cartModal.productQuantity}>Quantidade</span>
                  <span className={cartModal.productSubtotal}>Subtotal</span>
                </div>

                {tempCart.map(({ id, name, price, quantity }) => (
                  <div className={cartModal.productItem} key={id}>
                    <span className={cartModal.productName}>{name}</span>
                    <div className={cartModal.quantityControls}>
                      <button onClick={() => updateQuantity(id, quantity - 1)}>
                        -
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(id, quantity + 1)}>
                        +
                      </button>
                    </div>
                    <span className={cartModal.productSubtotal}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Se tempCart estiver vazio e o usuário não estiver logado */}
            {!signed && tempCart.length === 0 && (
              <div className={cartModal.message}>
                <p>Entre em sua conta para efetuar a compra.</p>
                <div>
                  <div className={cartModal.buttons}>
                    <Link to="/login">
                      <button
                        className={cartModal.loginBtn}
                        onClick={closeModalCart}
                      >
                        Login
                      </button>
                    </Link>
                    <Link to="/register">
                      <button
                        className={cartModal.registerBtn}
                        onClick={closeModalCart}
                      >
                        Inscreva-se
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Se tempCart tiver itens e o usuário não estiver logado */}
            {!signed && tempCart.length > 0 && (
              <div className={cartModal.message}>
                <p>Entre em sua conta para terminar sua compra.</p>
                <div>
                  <div className={cartModal.buttons}>
                    <Link to="/login">
                      <button
                        className={cartModal.loginBtn}
                        onClick={closeModalCart}
                      >
                        Login
                      </button>
                    </Link>
                    <Link to="/register">
                      <button
                        className={cartModal.registerBtn}
                        onClick={closeModalCart}
                      >
                        Inscreva-se
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className={cartModal.actions}>
              {signed && (
                <Link to="/cart">
                  <button
                    className={cartModal.viewCartBtn}
                    onClick={closeModalCart}
                  >
                    Ver Carrinho Completo
                  </button>
                </Link>
              )}

              <button className={cartModal.closeBtn} onClick={closeModalCart}>
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
