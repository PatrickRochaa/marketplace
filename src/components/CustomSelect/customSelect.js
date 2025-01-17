import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import styles from "./CustomSelect.module.css";
export function CustomSelect({ value, onSelect, categories, }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Referência ao dropdown (menu)
    // Função que lida com o clique em uma opção do menu
    const handleOptionClick = (id) => {
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
        const handleClickOutside = (event) => {
            // Verifica se o clique foi fora do dropdown (menu)
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
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
    return (_jsxs("div", { className: styles.container, ref: dropdownRef, children: [_jsx("div", { className: styles.selected, onClick: () => setIsOpen((prev) => !prev), "aria-expanded": isOpen ? "true" : "false", "aria-controls": "category-dropdown", children: selectedCategory ? selectedCategory.name : "Categorias" }), _jsxs("ul", { className: `${styles.options} ${isOpen ? styles.open : ""}`, id: "category-dropdown", role: "listbox", children: [_jsx("li", { className: styles.option, onClick: handleShowAll, role: "option", children: "Categorias" }), categories.map((category) => (_jsx("li", { className: styles.option, onClick: () => handleOptionClick(category.id), role: "option", children: category.name }, category.id)))] })] }));
}
