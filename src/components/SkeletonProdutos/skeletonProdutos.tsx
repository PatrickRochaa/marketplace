import styles from "./skeletonProdutos.module.css"; // Importe o CSS de estilização do Skeleton
import { Container } from "../Container/container";

export function Skeleton() {
  return (
    <Container>
      <div className={styles.skeletonContainer}>
        <div className={styles.skeleton}>
          <div className={styles.image}></div>
          <div className={styles.text}></div>
          <div className={styles.text}></div>
          <div className={styles.price}></div>
          <div className={styles.text}></div>
        </div>
      </div>
    </Container>
  );
}
