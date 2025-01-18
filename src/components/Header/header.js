import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import logoImg from "../../assets/logo.png"; // Importa a imagem do logo
import styles from "./globalHeader.module.css"; // Importa os estilos CSS do cabeçalho
import { Container } from "../Container/container"; // Importa o componente Container
import { Link } from "react-router-dom"; // Importa o Link para navegação
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2"; // Ícone para usuário deslogado
import { PiUserList } from "react-icons/pi"; // Ícone para usuário logado
import { useRef, useState, useEffect } from "react"; // Importa hooks do React
import { useAuth } from "../../context/AuthContext"; // Importa contexto de autenticação
export function GlobalHeader() {
    // Desestruturação dos valores do contexto de autenticação
    const { signed, loadingAuth, handleLogout } = useAuth();
    // Estado para controlar a visibilidade do menu
    const [menuOpen, setMenuOpen] = useState(false);
    // Refs para referenciar elementos DOM
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    // Efeito para detectar clique fora do menu e fechá-lo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setMenuOpen(false); // Fecha o menu se o clique for fora
            }
        };
        document.addEventListener("mousedown", handleClickOutside); // Adiciona evento de clique
        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Limpa evento ao desmontar
        };
    }, []);
    // Função para alternar a visibilidade do menu
    const toggleMenu = () => setMenuOpen((prev) => !prev);
    if (loadingAuth) {
        return null; // Retorna null enquanto a autenticação está carregando
    }
    return (_jsx(Container, { children: _jsxs("header", { className: styles.containerHeader, children: [_jsxs(Link, { to: "/", children: [" ", _jsx("img", { src: logoImg, alt: "Logo do site", className: styles.imgHeader }), " "] }), signed ? ( // Se o usuário estiver autenticado, exibe o menu de usuário
                _jsxs("div", { className: styles.userMenu, children: [_jsxs("div", { className: styles.login, onClick: toggleMenu, ref: buttonRef, children: [_jsx(PiUserList, { size: 24, color: "#000" }), " "] }), _jsxs("div", { ref: menuRef, className: `${styles.dropMenu} ${menuOpen ? styles.menuOpen : "" // Aplica a classe 'menuOpen' se o menu estiver aberto
                            }`, children: [_jsxs(Link, { to: "/dashboard", onClick: () => setMenuOpen(false), children: [_jsx("p", { className: styles.btnMenu, children: "Dashboard" }), " "] }), _jsxs(Link, { to: "/dashboard/new", onClick: () => setMenuOpen(false), children: [_jsx("p", { className: styles.btnMenu, children: "Novo Produto" }), " "] }), _jsxs(Link, { to: "/cart", onClick: () => setMenuOpen(false), children: [_jsx("p", { className: styles.btnMenu, children: "Carrinho" }), " "] }), _jsxs(Link, { to: "/", onClick: () => {
                                        handleLogout(); // Chama a função de logout
                                        setMenuOpen(false); // Fecha o menu após logout
                                    }, children: [_jsx("p", { className: styles.btnLogout, children: "Sair" }), " "] })] })] })) : (
                // Se o usuário não estiver autenticado, exibe o botão de login
                _jsx(Link, { to: "/login", children: _jsxs("div", { className: styles.login, children: [_jsx(HiOutlineArrowRightOnRectangle, { size: 24, color: "#000" }), " "] }) }))] }) }));
}
export default GlobalHeader; // Exporta o componente GlobalHeader
