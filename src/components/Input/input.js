import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./input.module.css";
export function Input({ type, placeholder, name, register, error, rules, }) {
    return (_jsxs("div", { children: [_jsx("input", Object.assign({ type: type, placeholder: placeholder }, register(name, rules), { id: name, className: styles.input })), error && _jsx("p", { className: styles.erro, children: error })] }));
}
