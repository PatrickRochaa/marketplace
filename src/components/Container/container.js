import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./containerGeral.module.css";
export function Container({ children }) {
    return _jsx("div", { className: styles.containerGeral, children: children });
}
