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
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref para o menu

  //context do carrinho de compras para limparo carrinho que fizer Logout
  // const { cartItems } = useCart();

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <Container>
      <header className={styles.containerHeader}>
        <Link to="/">
          <img src={logoImg} alt="Logo do site" className={styles.imgHeader} />
        </Link>

        {signed ? (
          <div className={styles.userMenu}>
            {/* Ícone de usuário logado */}
            <div className={styles.login} onClick={toggleMenu}>
              <FiUser size={20} color="#000" />
            </div>

            {menuOpen && ( // Sub-menu
              <div ref={menuRef} className={styles.dropMenu}>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
                >
                  <p className={styles.btnMenu}>Dashboard</p>
                </Link>
                <Link
                  to="/dashboard/new"
                  onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
                >
                  <p className={styles.btnMenu}>Novo Produto</p>
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar
                >
                  <p className={styles.btnMenu}>Carrinho</p>
                </Link>

                <Link
                  to="/"
                  onClick={() => {
                    handleLogout(); // Realiza o logout
                    setMenuOpen(false); // Fecha o menu
                  }}
                >
                  <p className={styles.btnLogout}>Sair</p>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            {/* Ícone de usuário deslogado */}
            <div className={styles.login}>
              <FiLogIn size={20} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </Container>
  );
}

export default GlobalHeader;
