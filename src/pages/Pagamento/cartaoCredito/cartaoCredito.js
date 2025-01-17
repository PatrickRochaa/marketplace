import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import styles from "./cartaoCredito.module.css"; // Importando o CSS do cartão de crédito
import { Container } from "../../../components/Container/container";
// Importando os logos das bandeiras de cartão
import visaLogo from "../../../logos/visa.svg";
import mastercardLogo from "../../../logos/mastercard.svg";
import amexLogo from "../../../logos/amex.svg";
import discoverLogo from "../../../logos/discover.svg";
import defaultCardLogo from "../../../assets/logo.png"; // Fallback para outros cartões
import { useCart } from "../../../context/CartContext"; // Contexto do carrinho de compras
// Importando o ícone de chip do cartão
import { FcSimCardChip } from "react-icons/fc";
export function CartaoCredito({ isCardValid, setIsCardValid, }) {
    const [flipCard, setFlipCard] = useState(false);
    const { cartItems } = useCart(); // Carrinho de compras
    const [installments, setInstallments] = useState(1); //numero de parcela
    // Estado para aplicar o efeito de brilho no cartão
    const [isCardGlowing, setIsCardGlowing] = useState(false);
    // Estado para armazenar os dados do cartão de crédito
    const [cardData, setCardData] = useState({
        number: "",
        holderName: "",
        expiryDate: "",
        cvv: "",
    });
    // Atualiza o estado `isCardValid` quando `cardData` muda
    useEffect(() => {
        const isValid = cardData.number.trim() !== "" &&
            cardData.holderName.trim() !== "" &&
            cardData.expiryDate.trim() !== "" &&
            cardData.cvv.trim() !== "";
        // Passando a atualização para o componente pai
        setIsCardValid(isValid);
    }, [cardData, setIsCardValid]);
    /* ====================================================== */
    // Efeito quando o cartão for válido
    useEffect(() => {
        if (isCardValid) {
            setIsCardGlowing(true); // Ativa o brilho
        }
        else {
            setIsCardGlowing(false); // Desativa o brilho
        }
    }, [isCardValid]); // Esse efeito será disparado sempre que 'isCardValid' muda
    /* ====================================================== */
    // Função para lidar com a mudança no número do cartão
    const handleCardNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, "");
        const formattedInput = input.replace(/(\d{4})(?=\d)/g, "$1 ");
        if (formattedInput.length <= 19) {
            setCardData(Object.assign(Object.assign({}, cardData), { number: formattedInput }));
        }
    };
    /* ====================================================== */
    // Função para lidar com as mudanças nos outros campos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "cvv") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 3);
            setCardData((prevData) => (Object.assign(Object.assign({}, prevData), { [name]: formattedValue })));
        }
        else {
            setCardData((prevData) => (Object.assign(Object.assign({}, prevData), { [name]: value })));
        }
    };
    /* ====================================================== */
    // Função para lidar com a mudança no campo de validade (sem verificação)
    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
        if (value.length > 4)
            value = value.slice(0, 4); // Limita a 4 caracteres
        if (value.length >= 2)
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Formata como MM/AA
        // Atualiza a data de validade sem verificar a validade
        setCardData((prevData) => (Object.assign(Object.assign({}, prevData), { expiryDate: value })));
    };
    // Função para renderizar o logo do cartão e o nome
    const cardLogos = {
        "4": visaLogo,
        "5": mastercardLogo,
        "3": amexLogo,
        "6": discoverLogo,
    };
    const getCardIconWithName = (number) => {
        const cardPrefix = number[0]; // Assegura que cardPrefix será uma dessas opções
        const cardIcon = cardLogos[cardPrefix] || defaultCardLogo;
        const cardName = cardPrefix === "4"
            ? "Visa"
            : cardPrefix === "5"
                ? "Mastercard"
                : cardPrefix === "3"
                    ? "American Express"
                    : cardPrefix === "6"
                        ? "Discover"
                        : "Crédito";
        return (_jsxs("div", { className: styles.cardLogo, children: [_jsx("img", { src: cardIcon, alt: cardName }), _jsx("span", { children: cardName })] }));
    };
    /* ====================================================== */
    // Função para lidar com o foco no campo CVV (para girar o cartão)
    const handleCardFocus = (focusOnCvv) => {
        if (focusOnCvv) {
            setFlipCard(true); // Gira o cartão para mostrar o verso
        }
        else {
            setFlipCard(false); // Volta para a frente do cartão
        }
    };
    /* ====================================================== */
    // Calcula o valor total da compra
    const totalAmount = cartItems.reduce((total, { price, quantity }) => total + price * quantity, 0);
    /* ====================================================== */
    // Função para lidar com a mudança no número de parcelas
    const handleInstallmentsChange = (e) => {
        setInstallments(parseInt(e.target.value));
    };
    /* ====================================================== */
    return (_jsx(Container, { children: _jsxs("div", { className: styles.creditCardContainer, children: [_jsxs("div", { className: styles.cardInputs, children: [_jsxs("label", { children: ["N\u00FAmero do Cart\u00E3o:", _jsx("input", { type: "text", value: cardData.number, onChange: handleCardNumberChange, maxLength: 19, pattern: "\\d*", placeholder: "N\u00FAmero do Cart\u00E3o", required: true, className: styles.input, onFocus: () => handleCardFocus(false) })] }), _jsxs("label", { children: ["Nome do Titular:", _jsx("input", { type: "text", name: "holderName", placeholder: "Nome Completo", value: cardData.holderName, onChange: handleInputChange, className: styles.input, onFocus: () => handleCardFocus(false) })] }), _jsxs("div", { className: styles.cardDetails, children: [_jsxs("label", { children: ["Validade:", _jsx("input", { type: "text", name: "expiryDate", placeholder: "MM/AA", className: styles.input, value: cardData.expiryDate, onChange: handleExpiryDateChange, onFocus: () => handleCardFocus(false) })] }), _jsxs("label", { children: ["CVV:", _jsx("input", { type: "text", name: "cvv", placeholder: "CVV", className: styles.input, value: cardData.cvv, onChange: handleInputChange, maxLength: 3, minLength: 3, onFocus: () => handleCardFocus(true) })] })] }), _jsx("div", { className: styles.installmentsContainer, children: _jsx("select", { value: installments, onChange: handleInstallmentsChange, onFocus: () => handleCardFocus(false), children: [...Array(10)].map((_, index) => {
                                    const parcelas = index + 1;
                                    const valorParcela = totalAmount / parcelas;
                                    const valorParcelaFormatado = new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(valorParcela);
                                    return (_jsxs("option", { value: parcelas, children: [parcelas, "x de ", valorParcelaFormatado] }, index));
                                }) }) })] }), _jsx("div", { className: styles.cardPreview, children: _jsxs("div", { className: `${styles.card} ${flipCard ? styles.flipped : ""} ${isCardGlowing ? styles.glowing : ""}`, children: [_jsxs("div", { className: styles.cardFront, children: [_jsxs("div", { className: styles.cardLogo, children: [_jsx(FcSimCardChip, { size: 30 }), getCardIconWithName(cardData.number)] }), _jsx("div", { className: styles.cardNumber, children: cardData.number || "0000 0000 0000 0000" }), _jsxs("div", { className: styles.cardHolder, children: [_jsx("span", { children: cardData.holderName || "NOME COMPLETO" }), _jsx("span", { children: cardData.expiryDate || "MM/AA" })] }), _jsx("div", { className: styles.cardSecure, children: _jsx("span", { children: "\uD83D\uDD12 Seus dados est\u00E3o seguros" }) })] }), _jsxs("div", { className: styles.cardBack, children: [_jsx("div", { className: styles.blackBar }), _jsx("div", { className: styles.cvvContainer, children: _jsx("span", { children: cardData.cvv || "•••" }) })] })] }) })] }) }));
}
