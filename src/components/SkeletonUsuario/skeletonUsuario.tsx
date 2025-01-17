import styles from "./skeletonUsuario.module.css";

export function Skeleton() {
  return (
    <div className={styles.profileBorder}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonContainer}>
        <div className={styles.skeletonItem}></div>
        <div className={styles.skeletonItem}></div>
        <div className={styles.skeletonItem}></div>
        <div className={styles.skeletonItem}></div>
        <div className={styles.skeletonItem}></div>
      </div>
    </div>
  );
}
