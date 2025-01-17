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
  const totalAmount = cartItems.reduce(
    (total, { price, quantity }) => total + price * quantity, // Calcula o total multiplicando o preço pela quantidade de cada item
    0
  );

  /* ================================================================= */

  const totalAmountFormatted = totalAmount.toFixed(2); // Formata o valor total para exibição (com 2 casas decimais)

  /* ================================================================= */

  // Função para lidar com a mudança do número de parcelas
  const handleInstallmentsChange = (
    e: React.ChangeEvent<HTMLSelectElement> // Evento de alteração no seletor de parcelas
  ) => {
    setInstallments(parseInt(e.target.value)); // Atualiza o número de parcelas com o valor selecionado
  };

  /* ================================================================= */

  return (
    <Container>
      <div className={styles.bankTransferInfo}>
        {/* Seção para selecionar o parcelamento */}
        <div className={styles.installmentsContainer}>
          <label>
            Pague com calma, a gente facilita.
            <select value={installments} onChange={handleInstallmentsChange}>
              {[...Array(10)].map((_, index) => {
                const parcelas = index + 1; // Número da parcela (1, 2, ..., 10)
                const valorParcela = totalAmount / parcelas; // Calcula o valor da parcela
                const valorParcelaFormatado = new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(valorParcela); // Formatação monetária para exibir como moeda

                return (
                  <option key={index} value={parcelas}>
                    {parcelas}x de {valorParcelaFormatado}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {/* Exibe o valor total da compra, formatado em moeda */}
        <p>
          O valor total da sua compra é:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(parseFloat(totalAmountFormatted))}
        </p>

        {/* Instruções para pagamento por boleto */}
        <p>
          Para pagamento por boleto, use o código abaixo ou visualize o boleto
          simulado:
        </p>

        {/* Exibe o código simulado do boleto */}
        <code>1234 5678 9101 1121</code>

        {/* Ícone representando o boleto */}
        <div className={styles.fakeBoletoIcon}>
          <FaBarcode size={50} />{" "}
          {/* Você pode ajustar o tamanho do ícone conforme necessário */}
        </div>

        {/* Botão de download do boleto */}
        <button
          className={styles.downloadButton}
          onClick={() => {
            // Exibe um toast de alerta informando que o boleto é simulado
            toast.error(
              "Este é um boleto simulado. Nenhum arquivo foi baixado."
            );
          }}
        >
          Baixar Boleto
        </button>

        {/* Mensagem explicativa sobre o boleto simulado */}
        <p className={styles.paymentInfo}>
          Este boleto é simulado para fins de teste. Não é possível realizar o
          pagamento real.
        </p>
      </div>
    </Container>
  );
}
