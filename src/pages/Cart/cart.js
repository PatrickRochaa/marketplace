import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import cartPageStyles from "./cart.module.css";
import { Container } from "../../components/Container/container";
import { Link } from "react-router-dom";
// Importando o Spinner
import { Spinner } from "../../components/Spinner/spinner";
import { BotaoHome } from "../../components/BotaoHome/botao";
export function CartPage() {
    const { cartItems, updateQuantity, total, removeFromCart } = useCart();
    //spinner
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Se os itens do carrinho mudarem, você pode considerar o carregamento concluído
        if (cartItems.length > 0) {
            setLoading(false); // Itens carregados, esconder o spinner
        }
        else if (cartItems.length === 0) {
            setLoading(false); // Carrinho vazio também pode ser considerado como carregado
        }
    }, [cartItems]); // O useEffect só executa uma vez, quando o componente é montado
    return (_jsx(Container, { children: _jsxs("div", { className: cartPageStyles.cartContainer, children: [_jsx("h1", { children: "Carrinho de Compras" }), loading ? (
                // Usando o Spinner ao invés do código duplicado
                _jsx(Spinner, { message: "Carregando Carrinho..." })) : cartItems.length === 0 ? (_jsx("p", { className: cartPageStyles.emptyCartMessage, children: "Seu carrinho est\u00E1 vazio." })) : (_jsx("div", { className: cartPageStyles.cartItems, children: cartItems.map(({ id, name, price, quantity, images }) => (_jsxs("div", { className: cartPageStyles.cartItem, children: [_jsxs("div", { className: cartPageStyles.cartShow, children: [_jsx("img", { src: Array.isArray(images) && typeof images[0] === "string"
                                            ? images[0]
                                            : "", alt: name, className: cartPageStyles.cartItemImage }), _jsx("span", { children: name })] }), _jsxs("div", { className: cartPageStyles.cartValores, children: [_jsxs("div", { className: cartPageStyles.cartQTD, children: [_jsx("strong", { className: cartPageStyles.itemPrice, children: new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(price) }), _jsxs("div", { className: cartPageStyles.quantityControls, children: [_jsx("button", { onClick: () => updateQuantity(id, quantity - 1), disabled: quantity <= 1, children: "-" }), _jsx("span", { children: quantity }), _jsx("button", { onClick: () => updateQuantity(id, quantity + 1), children: "+" })] })] }), _jsx("div", { children: _jsxs("div", { className: cartPageStyles.containerTotal, children: [_jsxs("span", { className: cartPageStyles.itemSubtotal, children: ["Subtotal:", " ", new Intl.NumberFormat("pt-BR", {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        }).format(price * quantity)] }), _jsx("button", { className: cartPageStyles.removeButton, onClick: () => removeFromCart(id), children: "Remover" })] }) })] })] }, id))) })), _jsxs("div", { className: cartPageStyles.cartSummary, children: [_jsxs("strong", { children: ["Total:", " ", new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(total)] }), _jsx(Link, { to: "/pagamento", children: _jsx("button", { className: cartPageStyles.checkoutButton, disabled: cartItems.length === 0, children: "Finalizar Compra" }) })] }), cartItems.length === 0 && (_jsx("div", { children: _jsx(BotaoHome, {}) }))] }) }));
}
