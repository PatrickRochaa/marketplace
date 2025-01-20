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
// icone botao carrinho
import { BsCartCheck } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext"; //contexto do usuario
import { useCart } from "../../context/CartContext"; //contexto do carrinho
import { Skeleton } from "../../components/SkeletonProdutos/skeletonProdutos";
import { Propaganda } from "../../components/Propaganda/propaganda";
export function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalProduct, setModalProduct] = useState(null);
    // modal detalhes
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para categoria selecionada
    const [selectedCategory, setSelectedCategory] = useState(0);
    //pegando usuario
    const { signed } = useAuth();
    //context do carrinho de compras
    const { addToCart, cartItems, updateQuantity, tempCart } = useCart();
    //modal carrinho
    const [isModalCart, setIsModalCart] = useState(false);
    //pesquisa
    const [searchTerm, setSearchTerm] = useState("");
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
        function fetchProducts() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    setLoading(true);
                    const { data, error } = yield supabase
                        .from("products")
                        .select("*")
                        .order("created_at", { ascending: false }); // Ordena pela coluna created_at de forma descendente
                    if (error)
                        throw new Error(error.message);
                    setProducts(data || []);
                    setFilteredProducts(data || []); // Inicializa a exibição com todos os produtos
                }
                catch (err) {
                    console.error("Erro ao carregar produtos:", err);
                }
                finally {
                    setLoading(false);
                }
            });
        }
        fetchProducts();
    }, []);
    /* =============================================================== */
    //Adicionando ao carrinho
    const handleAddToCart = (product) => {
        addToCart(product); // Usando a função do contexto para adicionar ao carrinho
        setIsModalOpen(true);
    };
    /* =============================================================== */
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowCartButton(true); // Exibe o botão quando rolar mais de 300px
            }
            else {
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
    const handleSelectCategory = (categoryId) => {
        setSelectedCategory(categoryId); // Atualiza a categoria selecionada
    };
    /* =============================================================== */
    /*Modal de detalhes */
    const openModal = (product) => {
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
    return (_jsxs(Container, { children: [_jsx("div", { className: styles.propaganda, children: _jsx(Propaganda, {}) }), _jsx("h1", { className: styles.tituloTopo, children: "Marketplace Fake" }), _jsxs("header", { className: styles.header, children: [_jsx("form", { className: styles.search_form, children: _jsx("input", { type: "text", placeholder: "Pesquise produtos...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: styles.search_input }) }), _jsx(CustomSelect, { value: selectedCategory, onSelect: handleSelectCategory, categories: categories.map((category) => (Object.assign(Object.assign({}, category), { id: Number(category.id) }))) })] }), _jsx("h2", { className: styles.subTitulo, children: "O produto dos seus sonhos est\u00E1 aqui!" }), loading ? (_jsx("section", { className: styles.products_container, children: [...Array(3)].map((_, index) => (_jsx(Skeleton, {}, index))) })) : filteredProducts.length === 0 ? (_jsxs("div", { className: styles.alertMessage, children: [_jsx("h2", { className: styles.alertInformation, children: "Ops!" }), _jsx("h2", { className: styles.alertInformation, children: "Nenhum produto encontrado." })] })) : (_jsx("section", { className: styles.products_container, children: filteredProducts.map((product) => (_jsxs("div", { className: styles.product_card, children: [_jsxs("div", { className: styles.linkDetail, onClick: () => openModal(product), children: [_jsx(FallbackImage, { src: String(product.images[0]), alt: product.name, errorMessage: "Imagem indispon\u00EDvel." }), _jsx("h3", { className: styles.name, children: product.name }), _jsx("p", { className: styles.description, children: product.description }), _jsx("p", { className: styles.price, children: new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(product.price) })] }), _jsx("button", { className: styles.btnCompra, onClick: () => handleAddToCart(product), children: "Adicionar ao Carrinho" })] }, product.id))) })), isModalOpen && modalProduct && (_jsx("div", { className: `${modalStyles.modalOverlay} ${isModalOpen ? modalStyles.open : ""}`, children: _jsxs("div", { className: modalStyles.modalContent, children: [_jsx("button", { className: modalStyles.closeBtn, onClick: closeModal, children: "X" }), _jsx("div", { className: modalStyles.imageContainer, children: _jsx(Swiper, { slidesPerView: 1, pagination: { clickable: true }, navigation: true, className: modalStyles.swiper, children: modalProduct.images.map((imageUrl, imageIndex) => (_jsx(SwiperSlide, { children: _jsx("img", { src: String(imageUrl), className: modalStyles.image, alt: `foto do produto ${modalProduct.name}` }) }, `${modalProduct.id}-${imageIndex}`))) }) }), _jsxs("div", { className: modalStyles.detailsContainer, children: [_jsx("h3", { className: modalStyles.name, children: modalProduct.name }), _jsx("p", { className: modalStyles.description, onClick: toggleDescription, children: isDescriptionOpen
                                        ? modalProduct.full_description
                                        : `${modalProduct.full_description.slice(0, 100)}...` }), _jsx("p", { className: modalStyles.price, children: new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(modalProduct.price) }), _jsx("button", { className: modalStyles.btnCompra, onClick: () => handleAddToCart(modalProduct), children: "Adicionar ao Carrinho" })] })] }) })), _jsxs("button", { className: `${cartModal.btnCart} ${showCartButton ? cartModal.visible : ""}`, onClick: openModalCart, children: [_jsx(BsCartCheck, { size: 30, color: "#fff" }), (signed ? cartItems : tempCart).length > 0 && (_jsx("span", { className: cartModal.cartCount, children: (signed ? cartItems : tempCart).length }))] }), isModalCart && (_jsx("div", { className: cartModal.containerCartModal, children: _jsxs("div", { className: cartModal.CartModal, children: [_jsx("h3", { className: cartModal.tituloCart, children: "Resumo Carrinho" }), signed && cartItems.length > 0 && (_jsxs("div", { className: cartModal.productSummary, children: [_jsxs("div", { className: cartModal.productHeader, children: [_jsx("span", { className: cartModal.productName, children: "Nome" }), _jsx("span", { className: cartModal.productQuantity, children: "Quantidade" }), _jsx("span", { className: cartModal.productSubtotal, children: "Subtotal" })] }), cartItems.map(({ id, name, price, quantity }) => (_jsxs("div", { className: cartModal.productItem, children: [_jsx("span", { className: cartModal.productName, children: name }), _jsxs("div", { className: cartModal.quantityControls, children: [_jsx("button", { onClick: () => updateQuantity(id, quantity - 1), children: "-" }), _jsx("span", { children: quantity }), _jsx("button", { onClick: () => updateQuantity(id, quantity + 1), children: "+" })] }), _jsx("span", { className: cartModal.productSubtotal, children: new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(price * quantity) })] }, id)))] })), signed && cartItems.length === 0 && (_jsx("p", { className: cartModal.message, children: "O carrinho est\u00E1 vazio." })), !signed && tempCart.length > 0 && (_jsxs("div", { className: cartModal.productSummary, children: [_jsxs("div", { className: cartModal.productHeader, children: [_jsx("span", { className: cartModal.productName, children: "Nome" }), _jsx("span", { className: cartModal.productQuantity, children: "Quantidade" }), _jsx("span", { className: cartModal.productSubtotal, children: "Subtotal" })] }), tempCart.map(({ id, name, price, quantity }) => (_jsxs("div", { className: cartModal.productItem, children: [_jsx("span", { className: cartModal.productName, children: name }), _jsxs("div", { className: cartModal.quantityControls, children: [_jsx("button", { onClick: () => updateQuantity(id, quantity - 1), children: "-" }), _jsx("span", { children: quantity }), _jsx("button", { onClick: () => updateQuantity(id, quantity + 1), children: "+" })] }), _jsx("span", { className: cartModal.productSubtotal, children: new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(price * quantity) })] }, id)))] })), !signed && tempCart.length === 0 && (_jsxs("div", { className: cartModal.message, children: [_jsx("p", { children: "Entre em sua conta para efetuar a compra." }), _jsx("div", { children: _jsxs("div", { className: cartModal.buttons, children: [_jsx(Link, { to: "/login", children: _jsx("button", { className: cartModal.loginBtn, onClick: closeModalCart, children: "Login" }) }), _jsx(Link, { to: "/register", children: _jsx("button", { className: cartModal.registerBtn, onClick: closeModalCart, children: "Inscreva-se" }) })] }) })] })), !signed && tempCart.length > 0 && (_jsxs("div", { className: cartModal.message, children: [_jsx("p", { children: "Entre em sua conta para terminar sua compra." }), _jsx("div", { children: _jsxs("div", { className: cartModal.buttons, children: [_jsx(Link, { to: "/login", children: _jsx("button", { className: cartModal.loginBtn, onClick: closeModalCart, children: "Login" }) }), _jsx(Link, { to: "/register", children: _jsx("button", { className: cartModal.registerBtn, onClick: closeModalCart, children: "Inscreva-se" }) })] }) })] })), _jsxs("div", { className: cartModal.actions, children: [signed && (_jsx(Link, { to: "/cart", children: _jsx("button", { className: cartModal.viewCartBtn, onClick: closeModalCart, children: "Ver Carrinho Completo" }) })), _jsx("button", { className: cartModal.closeBtn, onClick: closeModalCart, children: "X" })] })] }) }))] }));
}
