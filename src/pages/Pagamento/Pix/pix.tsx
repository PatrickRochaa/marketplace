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

  return (
    <Container>
      <div className={styles.pixInfo}>
        <p>Use o QR Code abaixo para realizar o pagamento:</p>

        {/* Exibe o ícone de QR Code */}
        <FaQrcode size={100} className={styles.qrCode} />

        <div className={styles.pixDetails}>
          <p>
            <strong>Número do PIX:</strong>{" "}
            {`0${Math.random()
              .toString(36)
              .substring(2, 15)
              .toUpperCase()}-SIMULADO-${Math.floor(Math.random() * 1000)}`}
          </p>

          {/* Botão para copiar o código do PIX */}
          <button
            onClick={() => {
              const pixCode = `0${Math.random()
                .toString(36)
                .substring(2, 15)
                .toUpperCase()}-SIMULADO-${Math.floor(Math.random() * 1000)}`;
              navigator.clipboard
                .writeText(pixCode)
                .then(() => toast.success("Código PIX copiado com sucesso!"))
                .catch(() => alert("Falha ao copiar o código PIX."));
            }}
            className={styles.copyButton}
          >
            Copiar Código PIX
          </button>
        </div>

        <div className={styles.paymentInfo}>
          <p>
            <strong>Valor a ser pago:</strong>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              cartItems.reduce(
                (total, { price, quantity }) => total + price * quantity,
                0
              )
            )}
          </p>
        </div>

        <div className={styles.instructions}>
          <p>
            Para concluir o pagamento, escaneie o QR Code ou use a chave PIX
            fornecida acima.
          </p>
        </div>
      </div>
    </Container>
  );
}
