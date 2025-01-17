import { useState, useEffect } from "react";
import { Container } from "../../../components/Container/container"; //container geral
import { BotaoHome } from "../../../components/BotaoHome/botao";
import { FaDollarSign } from "react-icons/fa"; // Ícone de dólar
import { FaTruck } from "react-icons/fa"; // Ícone de caminhão
import styles from "./fim.module.css";
// Importando a biblioteca Confetti
import Confetti from "react-confetti";

export function Fim() {
  const [stage, setStage] = useState("processing"); // Estados: "processing", "success", "shipped"
  const [showConfetti, setShowConfetti] = useState(false); // Controla quando mostrar o Confetti
  const [showButton, setShowButton] = useState(false); // Controla a exibição do botão

  useEffect(() => {
    if (stage === "processing") {
      setTimeout(() => setStage("success"), 7000); // Simula o pagamento sendo processado
    } else if (stage === "success") {
      setTimeout(() => setStage("shipped"), 5000); // Após o sucesso, simula o envio do pedido
    } else if (stage === "shipped") {
      setTimeout(() => {
        setShowConfetti(true); // Aparece o Confetti 2 segundos após o caminhão aparecer
      }, 2000);
      setTimeout(() => {
        setShowButton(true); // Exibe o botão 5 segundos após o caminhão aparecer
      }, 5000);
    }
  }, [stage]);

  return (
    <Container>
      {stage === "processing" && (
        <div className={styles.processing}>
          <FaDollarSign size={50} className={styles.dollarFlip} />
          <h2>Processando pagamento...</h2>
        </div>
      )}

      {stage === "success" && (
        <div className={styles.success}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="green"
            strokeWidth="2"
            className={styles.checkIcon}
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2>Pagamento realizado com sucesso!</h2>
        </div>
      )}

      {stage === "shipped" && (
        <div className={styles.shipped}>
          <FaTruck className={styles.truckIcon} />
          <h2>Pedido enviado com sucesso! </h2>
          {/* Exibir Confetti 2 segundos após o caminhão aparecer */}
          {showConfetti && <Confetti className={styles.confetti} />}
          {/* Exibir botão após o confetti */}
          {showButton && <BotaoHome />}
        </div>
      )}
    </Container>
  );
}
