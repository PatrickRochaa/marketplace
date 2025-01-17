import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import logoImg from "../../assets/logo.png";
import styles from "./globalHeader.module.css";
import { Container } from "../Container/container";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi"; // Ícones do React Icons
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Contexto usuario
export function GlobalHeader() {
    const { signed, loadingAuth, handleLogout } = useAuth(); // Contexto de autenticação
    const [menuOpen, setMenuOpen] = useState(false); // Controla o estado do menu
    const menuRef = useRef(null); // Ref para o menu
    //context do carrinho de compras para limparo carrinho que fizer Logout
    // const { cartItems } = useCart();
    // Fecha o menu se clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Não exibe nada até que o carregamento esteja completo
    if (loadingAuth) {
        return null;
    }
    // Função que alterna o estado da variável que controla se o menu está aberto
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };
    return (_jsx(Container, { children: _jsxs("header", { className: styles.containerHeader, children: [_jsx(Link, { to: "/", children: _jsx("img", { src: logoImg, alt: "Logo do site", className: styles.imgHeader }) }), signed ? (_jsxs("div", { className: styles.userMenu, children: [_jsx("div", { className: styles.login, onClick: toggleMenu, children: _jsx(FiUser, { size: 20, color: "#000" }) }), menuOpen && ( // Sub-menu
                        _jsxs("div", { ref: menuRef, className: styles.dropMenu, children: [_jsx(Link, { to: "/dashboard", onClick: () => setMenuOpen(false), children: _jsx("p", { className: styles.btnMenu, children: "Dashboard" }) }), _jsx(Link, { to: "/dashboard/new", onClick: () => setMenuOpen(false), children: _jsx("p", { className: styles.btnMenu, children: "Novo Produto" }) }), _jsx(Link, { to: "/cart", onClick: () => setMenuOpen(false), children: _jsx("p", { className: styles.btnMenu, children: "Carrinho" }) }), _jsx(Link, { to: "/", onClick: () => {
                                        handleLogout(); // Realiza o logout
                                        setMenuOpen(false); // Fecha o menu
                                    }, children: _jsx("p", { className: styles.btnLogout, children: "Sair" }) })] }))] })) : (_jsx(Link, { to: "/login", children: _jsx("div", { className: styles.login, children: _jsx(FiLogIn, { size: 20, color: "#000" }) }) }))] }) }));
}
export default GlobalHeader;
