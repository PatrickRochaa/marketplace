import { useState, useEffect, useRef } from "react";
import { Container } from "../../components/Container/container"; // Importa o componente Container
import styles from "./periodo.module.css";

// Definindo a interface para as props
interface PeriodoProps {
  selectedPeriod: string; // Tipo string para o período selecionado
  onChange: (id: string) => void; // Função que recebe um id e não retorna nada
}

export function Periodo({ selectedPeriod, onChange }: PeriodoProps) {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a visibilidade do dropdown
  const dropdownRef = useRef<HTMLUListElement | null>(null); // Referência ao dropdown (ul)
  const buttonRef = useRef<HTMLDivElement | null>(null); // Referência ao botão que abre/fecha o dropdown

  // Lista de períodos disponíveis
  const periods = [
    { id: "all", name: "Todo o período" },
    { id: "10", name: "Últimos 10 dias" },
    { id: "15", name: "Últimos 15 dias" },
    { id: "30", name: "Últimos 30 dias" },
  ];

  // Função que lida com o clique em uma opção do dropdown
  const handleOptionClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique no item feche o menu
    onChange(id); // Chama a função onChange passando o id selecionado
    setIsOpen(false); // Fecha o dropdown
  };

  // Função que fecha o menu quando o clique ocorre fora do dropdown ou do botão
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) && // Verifica se o clique foi fora do dropdown
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node) // Verifica se o clique foi fora do botão
    ) {
      setIsOpen(false); // Fecha o dropdown
    }
  };

  // Hook useEffect para adicionar e remover o ouvinte de clique fora do componente
  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // Adiciona o ouvinte para cliques fora
    return () => {
      document.removeEventListener("click", handleClickOutside); // Limpa o ouvinte ao desmontar o componente
    };
  }, []);

  return (
    <Container>
      {" "}
      {/* Mantendo o Container */}
      <div className={styles.periodoWrapper}>
        <label htmlFor="periodo" className={styles.label}>
          Período:
        </label>
        <div className={styles.selectWrapper}>
          {/* Botão que abre o dropdown */}
          <div
            ref={buttonRef}
            className={styles.selected}
            onClick={() => setIsOpen((prev) => !prev)} // Alterna a visibilidade do dropdown
            aria-expanded={isOpen ? "true" : "false"} // Acessibilidade: informa se o dropdown está aberto
            aria-controls="period-dropdown"
          >
            {/* Exibe o nome do período selecionado ou o texto padrão */}
            {periods.find((period) => period.id === selectedPeriod)?.name ||
              "Escolha o período"}
          </div>
          {/* Dropdown com as opções de período */}
          <ul
            ref={dropdownRef}
            className={`${styles.options} ${isOpen ? styles.open : ""}`}
            id="period-dropdown"
            role="listbox"
          >
            {/* Mapeia os períodos e gera a lista de opções */}
            {periods.map((period) => (
              <li
                key={period.id}
                className={styles.option}
                onClick={(event) => handleOptionClick(period.id, event)} // Chama a função ao clicar em uma opção
                role="option"
              >
                {period.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
