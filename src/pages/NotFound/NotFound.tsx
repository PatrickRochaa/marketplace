import { FaLaptop, FaTshirt, FaHeadphones, FaTv } from "react-icons/fa"; // Ícones de exemplo
import styles from "./NotFound.module.css";
import LogoIMG from "../../assets/logo.png";
import { Container } from "../../components/Container/container";
import { BotaoHome } from "../../components/BotaoHome/botao";

export function NotFound() {
  return (
    <Container>
      <div className={styles.notFoundContainer}>
        {/* Logo */}
        <img src={LogoIMG} alt="Logo" className={styles.logo} />

        {/* Texto explicativo */}
        <p className={styles.title}>Ops!</p>
        <p className={styles.title}>Página não encontrada.</p>
        <p className={styles.message}>
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* Ícones espalhados */}
        <div className={styles.iconsContainer}>
          <FaLaptop className={styles.icon} />
          <FaTshirt className={styles.icon} />
          <FaHeadphones className={styles.icon} />
          <FaTv className={styles.icon} />
        </div>

        {/* Botão para a Home */}
        <BotaoHome />
      </div>
    </Container>
  );
}
