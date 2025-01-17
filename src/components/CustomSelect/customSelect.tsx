import { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.css";

// Definindo a interface para as props
interface Category {
  id: number; // O id é um número
  name: string;
}

interface CustomSelectProps {
  value: number; // O value é agora apenas um número
  onSelect: (id: number) => void; // A função onSelect agora recebe apenas um número
  categories: Category[]; // Array de categorias
}

export function CustomSelect({
  value,
  onSelect,
  categories,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Referência ao dropdown (menu)

  // Função que lida com o clique em uma opção do menu
  const handleOptionClick = (id: number) => {
    onSelect(id); // Passando o id como número
    setIsOpen(false); // Fecha o menu
  };

  // Função para mostrar todas as categorias
  const handleShowAll = () => {
    onSelect(0); // Passando 0 (ou outro valor adequado) quando "Categorias" for selecionado
    setIsOpen(false); // Fecha o menu
  };

  // Obter a categoria selecionada
  const selectedCategory = categories.find((category) => category.id === value);

  // Fecha o menu quando o clique ocorre fora do dropdown ou do botão
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se o clique foi fora do dropdown (menu)
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Fecha o menu
      }
    };

    // Adiciona o listener de clique fora
    document.addEventListener("mousedown", handleClickOutside);

    // Limpa o listener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Contêiner do dropdown */}
      <div
        className={styles.selected}
        onClick={() => setIsOpen((prev) => !prev)} // Alterna o estado do menu
        aria-expanded={isOpen ? "true" : "false"} // Acessibilidade
        aria-controls="category-dropdown"
      >
        {selectedCategory ? selectedCategory.name : "Categorias"}
      </div>
      {/* Dropdown com animação suave */}
      <ul
        className={`${styles.options} ${isOpen ? styles.open : ""}`} // Aplica a animação suave
        id="category-dropdown"
        role="listbox"
      >
        <li className={styles.option} onClick={handleShowAll} role="option">
          Categorias
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className={styles.option}
            onClick={() => handleOptionClick(category.id)} // Passando o id como número
            role="option"
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
