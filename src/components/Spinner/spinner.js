import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container } from "../Container/container";
import styles from "./spinner.module.css";
export function Spinner({ message = "Carregando..." }) {
    // Prop padrão
    return (_jsx(Container, { children: _jsxs("div", { className: styles.loading, children: [_jsx("div", { className: styles.spinner }), _jsx("h3", { className: styles.textSpinner, children: message })] }) }));
}
