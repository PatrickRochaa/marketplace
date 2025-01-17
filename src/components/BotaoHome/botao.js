import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./botao.module.css";
import { Container } from "../Container/container";
import { Link } from "react-router-dom";
export function BotaoHome() {
    return (_jsx(Container, { children: _jsx(Link, { to: "/", children: _jsx("button", { className: styles.button, children: "P\u00E1gina Inicial" }) }) }));
}
