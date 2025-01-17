import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Container } from "../../components/Container/container"; // Importa o componente Container
import styles from "./periodo.module.css";
export function Periodo({ selectedPeriod, onChange }) {
    var _a;
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a visibilidade do dropdown
    const dropdownRef = useRef(null); // Referência ao dropdown (ul)
    const buttonRef = useRef(null); // Referência ao botão que abre/fecha o dropdown
    // Lista de períodos disponíveis
    const periods = [
        { id: "all", name: "Todo o período" },
        { id: "10", name: "Últimos 10 dias" },
        { id: "15", name: "Últimos 15 dias" },
        { id: "30", name: "Últimos 30 dias" },
    ];
    // Função que lida com o clique em uma opção do dropdown
    const handleOptionClick = (id, event) => {
        event.stopPropagation(); // Impede que o clique no item feche o menu
        onChange(id); // Chama a função onChange passando o id selecionado
        setIsOpen(false); // Fecha o dropdown
    };
    // Função que fecha o menu quando o clique ocorre fora do dropdown ou do botão
    const handleClickOutside = (event) => {
        if (dropdownRef.current &&
            !dropdownRef.current.contains(event.target) && // Verifica se o clique foi fora do dropdown
            buttonRef.current &&
            !buttonRef.current.contains(event.target) // Verifica se o clique foi fora do botão
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
    return (_jsxs(Container, { children: [" ", _jsxs("div", { className: styles.periodoWrapper, children: [_jsx("label", { htmlFor: "periodo", className: styles.label, children: "Per\u00EDodo:" }), _jsxs("div", { className: styles.selectWrapper, children: [_jsx("div", { ref: buttonRef, className: styles.selected, onClick: () => setIsOpen((prev) => !prev), "aria-expanded": isOpen ? "true" : "false", "aria-controls": "period-dropdown", children: ((_a = periods.find((period) => period.id === selectedPeriod)) === null || _a === void 0 ? void 0 : _a.name) ||
                                    "Escolha o período" }), _jsx("ul", { ref: dropdownRef, className: `${styles.options} ${isOpen ? styles.open : ""}`, id: "period-dropdown", role: "listbox", children: periods.map((period) => (_jsx("li", { className: styles.option, onClick: (event) => handleOptionClick(period.id, event), role: "option", children: period.name }, period.id))) })] })] })] }));
}
