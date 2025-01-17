import styles from "./botao.module.css";
import { Container } from "../Container/container";

import { Link } from "react-router-dom";

export function BotaoHome() {
  return (
    <Container>
      <Link to="/">
        <button className={styles.button}>Página Inicial</button>
      </Link>
    </Container>
  );
}
