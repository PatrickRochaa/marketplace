import { ReactNode } from "react";
import styles from "./containerGeral.module.css";

export function Container({ children }: { children: ReactNode }) {
  return <div className={styles.containerGeral}>{children}</div>;
}
