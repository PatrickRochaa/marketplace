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

// Componente filho que recebe a prop isCardValid
interface CartaoCreditoProps {
  isCardValid: boolean;
  setIsCardValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CartaoCredito({
  isCardValid,
  setIsCardValid,
}: CartaoCreditoProps) {
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
    const isValid =
      cardData.number.trim() !== "" &&
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
    } else {
      setIsCardGlowing(false); // Desativa o brilho
    }
  }, [isCardValid]); // Esse efeito será disparado sempre que 'isCardValid' muda

  /* ====================================================== */

  // Função para lidar com a mudança no número do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    const formattedInput = input.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (formattedInput.length <= 19) {
      setCardData({ ...cardData, number: formattedInput });
    }
  };

  /* ====================================================== */

  // Função para lidar com as mudanças nos outros campos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setCardData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setCardData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  /* ====================================================== */

  // Função para lidar com a mudança no campo de validade (sem verificação)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    if (value.length > 4) value = value.slice(0, 4); // Limita a 4 caracteres
    if (value.length >= 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Formata como MM/AA

    // Atualiza a data de validade sem verificar a validade
    setCardData((prevData) => ({
      ...prevData,
      expiryDate: value,
    }));
  };

  // Função para renderizar o logo do cartão e o nome
  const cardLogos: { [key in "4" | "5" | "3" | "6"]: string } = {
    "4": visaLogo,
    "5": mastercardLogo,
    "3": amexLogo,
    "6": discoverLogo,
  };

  const getCardIconWithName = (number: string) => {
    const cardPrefix = number[0] as "4" | "5" | "3" | "6"; // Assegura que cardPrefix será uma dessas opções

    const cardIcon = cardLogos[cardPrefix] || defaultCardLogo;
    const cardName =
      cardPrefix === "4"
        ? "Visa"
        : cardPrefix === "5"
        ? "Mastercard"
        : cardPrefix === "3"
        ? "American Express"
        : cardPrefix === "6"
        ? "Discover"
        : "Crédito";

    return (
      <div className={styles.cardLogo}>
        <img src={cardIcon} alt={cardName} />
        <span>{cardName}</span>
      </div>
    );
  };

  /* ====================================================== */

  // Função para lidar com o foco no campo CVV (para girar o cartão)
  const handleCardFocus = (focusOnCvv: boolean) => {
    if (focusOnCvv) {
      setFlipCard(true); // Gira o cartão para mostrar o verso
    } else {
      setFlipCard(false); // Volta para a frente do cartão
    }
  };

  /* ====================================================== */

  // Calcula o valor total da compra
  const totalAmount: number = cartItems.reduce(
    (total, { price, quantity }) => total + price * quantity,
    0
  );

  /* ====================================================== */

  // Função para lidar com a mudança no número de parcelas
  const handleInstallmentsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInstallments(parseInt(e.target.value));
  };

  /* ====================================================== */

  return (
    <Container>
      <div className={styles.creditCardContainer}>
        <div className={styles.cardInputs}>
          {/* Número do Cartão */}
          <label>
            Número do Cartão:
            <input
              type="text"
              value={cardData.number}
              onChange={handleCardNumberChange}
              maxLength={19}
              pattern="\d*"
              placeholder="Número do Cartão"
              required
              className={styles.input}
              onFocus={() => handleCardFocus(false)}
            />
          </label>

          {/* Nome do Titular */}
          <label>
            Nome do Titular:
            <input
              type="text"
              name="holderName"
              placeholder="Nome Completo"
              value={cardData.holderName}
              onChange={handleInputChange}
              className={styles.input}
              onFocus={() => handleCardFocus(false)}
            />
          </label>

          <div className={styles.cardDetails}>
            {/* Validade */}
            <label>
              Validade:
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/AA"
                className={styles.input}
                value={cardData.expiryDate}
                onChange={handleExpiryDateChange}
                onFocus={() => handleCardFocus(false)}
              />
            </label>

            {/* CVV */}
            <label>
              CVV:
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                className={styles.input}
                value={cardData.cvv}
                onChange={handleInputChange}
                maxLength={3}
                minLength={3}
                onFocus={() => handleCardFocus(true)}
              />
            </label>
          </div>

          {/* Campo de Parcelamento */}
          <div className={styles.installmentsContainer}>
            <select
              value={installments}
              onChange={handleInstallmentsChange}
              onFocus={() => handleCardFocus(false)}
            >
              {[...Array(10)].map((_, index) => {
                const parcelas = index + 1;
                const valorParcela = totalAmount / parcelas;
                const valorParcelaFormatado = new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(valorParcela);

                return (
                  <option key={index} value={parcelas}>
                    {parcelas}x de {valorParcelaFormatado}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Container do cartão de crédito */}
        <div className={styles.cardPreview}>
          <div
            className={`${styles.card} ${flipCard ? styles.flipped : ""} ${
              isCardGlowing ? styles.glowing : ""
            }`}
          >
            {/*frente do cartao*/}
            <div className={styles.cardFront}>
              <div className={styles.cardLogo}>
                <FcSimCardChip size={30} />
                {getCardIconWithName(cardData.number)}
              </div>
              <div className={styles.cardNumber}>
                {cardData.number || "0000 0000 0000 0000"}
              </div>
              <div className={styles.cardHolder}>
                <span>{cardData.holderName || "NOME COMPLETO"}</span>
                <span>{cardData.expiryDate || "MM/AA"}</span>
              </div>
              <div className={styles.cardSecure}>
                <span>🔒 Seus dados estão seguros</span>
              </div>
            </div>

            {/*Vesro do cartao */}
            <div className={styles.cardBack}>
              <div className={styles.blackBar}></div>
              <div className={styles.cvvContainer}>
                <span>{cardData.cvv || "•••"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
