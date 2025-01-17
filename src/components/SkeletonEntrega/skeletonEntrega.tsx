// SkeletonEntrega.tsx
import styles from "./skeletonEntrega.module.css";

export function SkeletonEntrega() {
  return (
    <div className={styles.skeletonWrapper}>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
      <div className={styles.skeletonItem}></div>
    </div>
  );
}
