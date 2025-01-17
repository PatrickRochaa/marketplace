import { Container } from "../Container/container";
import styles from "./spinner.module.css";

export function Spinner({ message = "Carregando..." }) {
  // Prop padrão
  return (
    <Container>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <h3 className={styles.textSpinner}>{message}</h3>
      </div>
    </Container>
  );
}
