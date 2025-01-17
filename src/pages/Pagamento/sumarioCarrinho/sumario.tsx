import { Container } from "../../../components/Container/container";
import styles from "./sumary.module.css"; // importando dados do carrinho

// importando dados do carrinho
import { useCart } from "../../../context/CartContext";

// Definindo tipos para as props
interface DeliveryData {
  nome?: string;
  telefone?: string;
  endereco?: string;
  numero_casa?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface UserData {
  nome?: string;
  telefone?: string;
  endereco?: string;
  numero_casa?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface SumarioCarrinhoProps {
  deliveryData?: DeliveryData;
  userData?: UserData | null;
}

export function SumarioCarrinho({
  deliveryData,
  userData,
}: SumarioCarrinhoProps) {
  const { cartItems } = useCart();

  // Calculando o total do carrinho
  const total = cartItems.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  /* ================================================================= */

  // Formatando exibição WhatsApp
  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }

    // Retorna o número original se não corresponder ao formato esperado
    return phone;
  }

  /* ================================================================= */

  return (
    <Container>
      <div className={styles.cartSummary}>
        {cartItems.map(({ id, name, price, quantity, images }) => (
          <div key={id} className={styles.cartItem}>
            <img
              src={
                Array.isArray(images) && typeof images[0] === "string"
                  ? images[0]
                  : ""
              }
              alt={name}
              className={styles.itemImage}
            />
            <div className={styles.itemDetails}>
              <p>
                <strong>{name}</strong>
              </p>
              <p>Quantidade: {quantity}</p>
              <p>
                Valor:{" "}
                {(price * quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total do Carrinho */}
      <div className={styles.total}>
        <h4>Total:</h4>
        <p>
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      {/* Endereço de entrega */}
      <div className={styles.deliveryInfo}>
        <h3 className={styles.title}>Endereço de Entrega:</h3>
        <p className={styles.texto}>
          <span>
            Comprador: {deliveryData?.nome || userData?.nome}
            <span className={styles.separadorTraco}>-</span>{" "}
          </span>

          <span>Telefone: {formatPhoneNumber(userData?.telefone || "")}</span>
        </p>

        <p className={styles.texto}>
          <span>
            Rua: {(deliveryData?.endereco || userData?.endereco || "").trim()}
            <span className={styles.separadorVirgula}>,</span>
          </span>
          <span>
            Número:{" "}
            {(deliveryData?.numero_casa || userData?.numero_casa || "").trim()}
            <span className={styles.separadorTraco}>-</span>
          </span>
          <span>
            {(deliveryData?.cidade || userData?.cidade || "").trim()}
            <span className={styles.separadorVirgula}>,</span>
          </span>
          <span>
            {(deliveryData?.estado || userData?.estado || "").trim()}
            <span className={styles.separadorTraco}>-</span> CEP:{" "}
            {(deliveryData?.cep || userData?.cep || "").trim()}
          </span>
        </p>
      </div>
    </Container>
  );
}
