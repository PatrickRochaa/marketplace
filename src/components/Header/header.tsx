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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  // Efeito para detectar clique fora do menu e fechá-lo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
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

  return (
    <Container>
      <header className={styles.containerHeader}>
        <Link to="/">
          {" "}
          {/* Link para a página inicial */}
          <img
            src={logoImg}
            alt="Logo do site"
            className={styles.imgHeader}
          />{" "}
          {/* Logo */}
        </Link>

        {signed ? ( // Se o usuário estiver autenticado, exibe o menu de usuário
          <div className={styles.userMenu}>
            <div className={styles.login} onClick={toggleMenu} ref={buttonRef}>
              <PiUserList size={24} color="#000" />{" "}
              {/* Ícone de usuário logado */}
            </div>

            <div
              ref={menuRef}
              className={`${styles.dropMenu} ${
                menuOpen ? styles.menuOpen : "" // Aplica a classe 'menuOpen' se o menu estiver aberto
              }`}
            >
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                <p className={styles.btnMenu}>Dashboard</p>{" "}
                {/* Link para o painel de controle */}
              </Link>
              <Link to="/dashboard/new" onClick={() => setMenuOpen(false)}>
                <p className={styles.btnMenu}>Novo Produto</p>{" "}
                {/* Link para adicionar novo produto */}
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <p className={styles.btnMenu}>Carrinho</p>{" "}
                {/* Link para o carrinho */}
              </Link>
              <Link
                to="/"
                onClick={() => {
                  handleLogout(); // Chama a função de logout
                  setMenuOpen(false); // Fecha o menu após logout
                }}
              >
                <p className={styles.btnLogout}>Sair</p> {/* Link para sair */}
              </Link>
            </div>
          </div>
        ) : (
          // Se o usuário não estiver autenticado, exibe o botão de login
          <Link to="/login">
            <div className={styles.login}>
              <HiOutlineArrowRightOnRectangle size={24} color="#000" />{" "}
              {/* Ícone de login */}
            </div>
          </Link>
        )}
      </header>
    </Container>
  );
}

export default GlobalHeader; // Exporta o componente GlobalHeader
