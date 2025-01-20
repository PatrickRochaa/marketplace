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
    } else if (cartItems.length === 0) {
      setLoading(false); // Carrinho vazio também pode ser considerado como carregado
    }
  }, [cartItems]); // O useEffect só executa uma vez, quando o componente é montado

  return (
    <Container>
      <div className={cartPageStyles.cartContainer}>
        <h1>Carrinho de Compras</h1>

        {loading ? (
          // Usando o Spinner para carregamento do carrinho
          <Spinner message="Carregando Carrinho..." />
        ) : cartItems.length === 0 ? (
          <p className={cartPageStyles.emptyCartMessage}>
            Seu carrinho está vazio.
          </p>
        ) : (
          //exibiçao do produtos no carrinho
          <div className={cartPageStyles.cartItems}>
            {cartItems.map(({ id, name, price, quantity, images }) => (
              <div key={id} className={cartPageStyles.cartItem}>
                <div className={cartPageStyles.cartShow}>
                  <img
                    src={
                      Array.isArray(images) && typeof images[0] === "string"
                        ? images[0]
                        : ""
                    }
                    alt={name}
                    className={cartPageStyles.cartItemImage}
                  />
                  <span>{name}</span>
                </div>
                <div className={cartPageStyles.cartValores}>
                  <div className={cartPageStyles.cartQTD}>
                    <strong className={cartPageStyles.itemPrice}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(price)}
                    </strong>
                    <div className={cartPageStyles.quantityControls}>
                      <button
                        onClick={() => updateQuantity(id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(id, quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className={cartPageStyles.containerTotal}>
                      <span className={cartPageStyles.itemSubtotal}>
                        Subtotal:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(price * quantity)}
                      </span>
                      <button
                        className={cartPageStyles.removeButton}
                        onClick={() => removeFromCart(id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={cartPageStyles.cartSummary}>
          <strong>
            Total:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total)}
          </strong>
          <Link to="/pagamento">
            <button
              className={cartPageStyles.checkoutButton}
              disabled={cartItems.length === 0} // Desativa o botão se o carrinho estiver vazio
            >
              Finalizar Compra
            </button>
          </Link>
        </div>

        {/* Botão aparece apenas se o carrinho estiver vazio */}
        {cartItems.length === 0 && (
          <div>
            <BotaoHome />
          </div>
        )}
      </div>
    </Container>
  );
}
