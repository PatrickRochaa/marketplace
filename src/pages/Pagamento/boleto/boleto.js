import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import styles from "./boleto.module.css";
import { Container } from "../../../components/Container/container";
import { useCart } from "../../../context/CartContext"; // Importa o contexto do carrinho
// Ícone para boleto
import { FaBarcode } from "react-icons/fa";
// Biblioteca de alertas
import toast from "react-hot-toast";
export function Boleto() {
    // Obtém os itens do carrinho do contexto
    const { cartItems } = useCart();
    const [installments, setInstallments] = useState(1); // Estado para armazenar o número de parcelas
    /* ================================================================= */
    // Calcula o valor total da compra com base nos itens do carrinho
    const totalAmount = cartItems.reduce((total, { price, quantity }) => total + price * quantity, // Calcula o total multiplicando o preço pela quantidade de cada item
    0);
    /* ================================================================= */
    const totalAmountFormatted = totalAmount.toFixed(2); // Formata o valor total para exibição (com 2 casas decimais)
    /* ================================================================= */
    // Função para lidar com a mudança do número de parcelas
    const handleInstallmentsChange = (e // Evento de alteração no seletor de parcelas
    ) => {
        setInstallments(parseInt(e.target.value)); // Atualiza o número de parcelas com o valor selecionado
    };
    /* ================================================================= */
    return (_jsx(Container, { children: _jsxs("div", { className: styles.bankTransferInfo, children: [_jsx("div", { className: styles.installmentsContainer, children: _jsxs("label", { children: ["Pague com calma, a gente facilita.", _jsx("select", { value: installments, onChange: handleInstallmentsChange, children: [...Array(10)].map((_, index) => {
                                    const parcelas = index + 1; // Número da parcela (1, 2, ..., 10)
                                    const valorParcela = totalAmount / parcelas; // Calcula o valor da parcela
                                    const valorParcelaFormatado = new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(valorParcela); // Formatação monetária para exibir como moeda
                                    return (_jsxs("option", { value: parcelas, children: [parcelas, "x de ", valorParcelaFormatado] }, index));
                                }) })] }) }), _jsxs("p", { children: ["O valor total da sua compra \u00E9:", " ", new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(parseFloat(totalAmountFormatted))] }), _jsx("p", { children: "Para pagamento por boleto, use o c\u00F3digo abaixo ou visualize o boleto simulado:" }), _jsx("code", { children: "1234 5678 9101 1121" }), _jsxs("div", { className: styles.fakeBoletoIcon, children: [_jsx(FaBarcode, { size: 50 }), " "] }), _jsx("button", { className: styles.downloadButton, onClick: () => {
                        // Exibe um toast de alerta informando que o boleto é simulado
                        toast.error("Este é um boleto simulado. Nenhum arquivo foi baixado.");
                    }, children: "Baixar Boleto" }), _jsx("p", { className: styles.paymentInfo, children: "Este boleto \u00E9 simulado para fins de teste. N\u00E3o \u00E9 poss\u00EDvel realizar o pagamento real." })] }) }));
}
