import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./skeletonProdutos.module.css"; // Importe o CSS de estilização do Skeleton
import { Container } from "../Container/container";
export function Skeleton() {
    return (_jsx(Container, { children: _jsx("div", { className: styles.skeletonContainer, children: _jsxs("div", { className: styles.skeleton, children: [_jsx("div", { className: styles.image }), _jsx("div", { className: styles.text }), _jsx("div", { className: styles.text }), _jsx("div", { className: styles.price }), _jsx("div", { className: styles.text })] }) }) }));
}
