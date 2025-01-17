import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container } from "../../../components/Container/container";
import styles from "./sumary.module.css"; // importando dados do carrinho
// importando dados do carrinho
import { useCart } from "../../../context/CartContext";
export function SumarioCarrinho({ deliveryData, userData, }) {
    const { cartItems } = useCart();
    // Calculando o total do carrinho
    const total = cartItems.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    /* ================================================================= */
    // Formatando exibição WhatsApp
    function formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
        const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        }
        // Retorna o número original se não corresponder ao formato esperado
        return phone;
    }
    /* ================================================================= */
    return (_jsxs(Container, { children: [_jsx("div", { className: styles.cartSummary, children: cartItems.map(({ id, name, price, quantity, images }) => (_jsxs("div", { className: styles.cartItem, children: [_jsx("img", { src: Array.isArray(images) && typeof images[0] === "string"
                                ? images[0]
                                : "", alt: name, className: styles.itemImage }), _jsxs("div", { className: styles.itemDetails, children: [_jsx("p", { children: _jsx("strong", { children: name }) }), _jsxs("p", { children: ["Quantidade: ", quantity] }), _jsxs("p", { children: ["Valor:", " ", (price * quantity).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })] })] })] }, id))) }), _jsxs("div", { className: styles.total, children: [_jsx("h4", { children: "Total:" }), _jsx("p", { children: total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }) })] }), _jsxs("div", { className: styles.deliveryInfo, children: [_jsx("h3", { className: styles.title, children: "Endere\u00E7o de Entrega:" }), _jsxs("p", { className: styles.texto, children: [_jsxs("span", { children: ["Comprador: ", (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.nome) || (userData === null || userData === void 0 ? void 0 : userData.nome), _jsx("span", { className: styles.separadorTraco, children: "-" }), " "] }), _jsxs("span", { children: ["Telefone: ", formatPhoneNumber((userData === null || userData === void 0 ? void 0 : userData.telefone) || "")] })] }), _jsxs("p", { className: styles.texto, children: [_jsxs("span", { children: ["Rua: ", ((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.endereco) || (userData === null || userData === void 0 ? void 0 : userData.endereco) || "").trim(), _jsx("span", { className: styles.separadorVirgula, children: "," })] }), _jsxs("span", { children: ["N\u00FAmero:", " ", ((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.numero_casa) || (userData === null || userData === void 0 ? void 0 : userData.numero_casa) || "").trim(), _jsx("span", { className: styles.separadorTraco, children: "-" })] }), _jsxs("span", { children: [((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.cidade) || (userData === null || userData === void 0 ? void 0 : userData.cidade) || "").trim(), _jsx("span", { className: styles.separadorVirgula, children: "," })] }), _jsxs("span", { children: [((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.estado) || (userData === null || userData === void 0 ? void 0 : userData.estado) || "").trim(), _jsx("span", { className: styles.separadorTraco, children: "-" }), " CEP:", " ", ((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.cep) || (userData === null || userData === void 0 ? void 0 : userData.cep) || "").trim()] })] })] })] }));
}
