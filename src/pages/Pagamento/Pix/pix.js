import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./pix.module.css";
import { Container } from "../../../components/Container/container";
// importando dados do carrinho
import { useCart } from "../../../context/CartContext";
// Importando o ícone de QR Code
import { FaQrcode } from "react-icons/fa";
//alerta
import toast from "react-hot-toast";
export function Pix() {
    //carrinho
    const { cartItems } = useCart();
    return (_jsx(Container, { children: _jsxs("div", { className: styles.pixInfo, children: [_jsx("p", { children: "Use o QR Code abaixo para realizar o pagamento:" }), _jsx(FaQrcode, { size: 100, className: styles.qrCode }), _jsxs("div", { className: styles.pixDetails, children: [_jsxs("p", { children: [_jsx("strong", { children: "N\u00FAmero do PIX:" }), " ", `0${Math.random()
                                    .toString(36)
                                    .substring(2, 15)
                                    .toUpperCase()}-SIMULADO-${Math.floor(Math.random() * 1000)}`] }), _jsx("button", { onClick: () => {
                                const pixCode = `0${Math.random()
                                    .toString(36)
                                    .substring(2, 15)
                                    .toUpperCase()}-SIMULADO-${Math.floor(Math.random() * 1000)}`;
                                navigator.clipboard
                                    .writeText(pixCode)
                                    .then(() => toast.success("Código PIX copiado com sucesso!"))
                                    .catch(() => alert("Falha ao copiar o código PIX."));
                            }, className: styles.copyButton, children: "Copiar C\u00F3digo PIX" })] }), _jsx("div", { className: styles.paymentInfo, children: _jsxs("p", { children: [_jsx("strong", { children: "Valor a ser pago:" }), new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(cartItems.reduce((total, { price, quantity }) => total + price * quantity, 0))] }) }), _jsx("div", { className: styles.instructions, children: _jsx("p", { children: "Para concluir o pagamento, escaneie o QR Code ou use a chave PIX fornecida acima." }) })] }) }));
}
