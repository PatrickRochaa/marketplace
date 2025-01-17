import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaLaptop, FaTshirt, FaHeadphones, FaTv } from "react-icons/fa"; // Ícones de exemplo
import styles from "./NotFound.module.css";
import LogoIMG from "../../assets/logo.png";
import { Container } from "../../components/Container/container";
import { BotaoHome } from "../../components/BotaoHome/botao";
export function NotFound() {
    return (_jsx(Container, { children: _jsxs("div", { className: styles.notFoundContainer, children: [_jsx("img", { src: LogoIMG, alt: "Logo", className: styles.logo }), _jsx("p", { className: styles.title, children: "Ops!" }), _jsx("p", { className: styles.title, children: "P\u00E1gina n\u00E3o encontrada." }), _jsx("p", { className: styles.message, children: "A p\u00E1gina que voc\u00EA est\u00E1 procurando n\u00E3o existe ou foi movida." }), _jsxs("div", { className: styles.iconsContainer, children: [_jsx(FaLaptop, { className: styles.icon }), _jsx(FaTshirt, { className: styles.icon }), _jsx(FaHeadphones, { className: styles.icon }), _jsx(FaTv, { className: styles.icon })] }), _jsx(BotaoHome, {})] }) }));
}
