var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/Container/container";
import { useAuth } from "../../context/AuthContext"; // contexto usuário
import { supabase } from "../../services/supabaseClient"; // Instância do Supabase
import { Periodo } from "../../components/FiltroPeriodo/periodo"; // Importação Select Periodo
import styles from "./vendas.module.css";
//botao home
import { BotaoHome } from "../../components/BotaoHome/botao";
//spinner carregamento
import { Spinner } from "../../components/Spinner/spinner";
export function Vendas() {
    const { handleLogout, user } = useAuth(); // contexto usuário
    // Tipando o estado salesData como um array de objetos Sale
    const [salesData, setSalesData] = useState([]); // Para armazenar as vendas
    const [selectedPeriod, setSelectedPeriod] = useState("all"); // Padrão: últimos 10 dias
    const [loading, setLoading] = useState(false); // Estado para indicar carregamento
    const [totalVendido, setTotalVendido] = useState(0); // Estado para o total vendido
    // Adicionando estados para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [salesPerPage] = useState(4); // Definindo o número de compras por página
    // Função para buscar transações do usuário autenticado
    function fetchSales(period) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setLoading(true);
                // Busca as transações do comprador filtradas pelo período
                const { data, error } = yield supabase
                    .from("transacoes")
                    .select("*")
                    .eq("vendedor_id", user.id)
                    .order("data_transacao", { ascending: false });
                if (error)
                    throw error;
                // Converte e filtra os dados conforme o período
                const filteredData = (_a = data === null || data === void 0 ? void 0 : data.filter((transaction) => {
                    // Se o período for "all", não aplica nenhum filtro de data
                    if (period === "all") {
                        return true; // Retorna todas as transações
                    }
                    const transactionDate = new Date(transaction.data_transacao);
                    const now = new Date();
                    const diffInDays = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
                    return diffInDays <= parseInt(period);
                })) !== null && _a !== void 0 ? _a : [];
                /* ============================================================== */
                // Atualiza o estado com as transações
                const sales = filteredData.flatMap((transaction) => {
                    return transaction.itens.map((item) => {
                        // Formatação da data no formato dia/mês/ano
                        const formattedDate = new Date(transaction.data_transacao).toLocaleDateString("pt-BR");
                        return {
                            nome_produto: item.nome_produto, // Exibe o nome do produto
                            quantidade: item.quantidade,
                            preco: item.preco_unitario, // Ajuste conforme o seu banco
                            data_transacao: formattedDate, // Use a data formatada
                        };
                    });
                });
                // Calcular o total vendido
                const total = sales.reduce((acc, sale) => acc + sale.quantidade * sale.preco, 0);
                setTotalVendido(total);
                setSalesData(sales);
            }
            catch (error) {
                console.error("Erro ao buscar transações:", error);
            }
            finally {
                setLoading(false);
            }
        });
    }
    /* ============================================================== */
    // Busca as vendas ao alterar o período ou ao carregar a página
    useEffect(() => {
        fetchSales(selectedPeriod);
    }, [selectedPeriod, user === null || user === void 0 ? void 0 : user.id]);
    /* ============================================================== */
    // Função para mudar de página
    const paginate = (pageNumber) => {
        if (pageNumber < 1)
            pageNumber = 1; // Garante que a página não seja menor que 1
        if (pageNumber > Math.ceil(salesData.length / salesPerPage))
            pageNumber = Math.ceil(salesData.length / salesPerPage); // Garante que a página não ultrapasse o número total de páginas
        // Adiciona a classe fade-out antes de atualizar a página
        const tableElement = document.querySelector(`.${styles.salesTable}`);
        if (tableElement) {
            tableElement.classList.add(styles.fadeOut); // Ativa o efeito de fade-out
        }
        // Aguarda a transição de fade-out para então atualizar a página
        setTimeout(() => {
            setCurrentPage(pageNumber); // Atualiza a página atual
            if (tableElement) {
                tableElement.classList.remove(styles.fadeOut); // Remove a classe fade-out após a transição
            }
        }, 500); // Tempo correspondente ao fade-out
    };
    /* ========================================================== */
    return (_jsx(Container, { children: _jsxs("div", { className: styles.dashboard, children: [_jsxs("nav", { className: styles.sidebar, children: [_jsx("div", { className: styles.sidebarHeader, children: _jsx("h2", { children: "Meu Dashboard" }) }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/", children: "P\u00E1gina Inicial" }) }), _jsx("li", { children: _jsx(Link, { to: "/dashboard", children: "Dashboard" }) }), _jsx("li", { children: _jsx(Link, { to: "/dashboard/new", children: "Novo Produto" }) }), _jsx("li", { children: _jsx(Link, { to: "/profile", children: "Perfil" }) }), _jsx("li", { children: _jsx(Link, { to: "/cart", children: "Carrinho" }) }), _jsx("li", { children: _jsx(Link, { to: "/compras", children: "Compras" }) }), _jsx("li", { children: _jsx(Link, { to: "/", onClick: () => {
                                            handleLogout(); // Realiza o logout
                                        }, children: "Sair" }) })] })] }), _jsx("main", { className: styles.mainContent, children: _jsxs("section", { className: styles.salesTableContainer, children: [_jsx("h1", { className: styles.title, children: "Vendas Realizadas" }), _jsx(Periodo, { selectedPeriod: selectedPeriod, onChange: setSelectedPeriod }), loading ? (_jsx(Spinner, { message: "Carregando Compras..." })) : salesData.length === 0 ? (_jsxs(_Fragment, { children: [_jsx("p", { className: styles.alert, children: "Nenhuma compra foi realizada no per\u00EDodo selecionado." }), _jsx(BotaoHome, {})] })) : (_jsxs(_Fragment, { children: [_jsxs("table", { className: styles.salesTable, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Produto" }), _jsx("th", { children: "Itens" }), _jsx("th", { children: "Pre\u00E7o Unit\u00E1rio" }), _jsx("th", { children: "Total" }), _jsx("th", { children: "Data" })] }) }), _jsx("tbody", { children: salesData
                                                    .slice((currentPage - 1) * salesPerPage, currentPage * salesPerPage)
                                                    .map((sale, index) => (_jsxs("tr", { children: [_jsx("td", { children: sale.nome_produto }), _jsx("td", { children: sale.quantidade }), _jsx("td", { children: new Intl.NumberFormat("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }).format(sale.preco) }), _jsx("td", { children: new Intl.NumberFormat("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }).format(sale.quantidade * sale.preco) }), _jsx("td", { children: sale.data_transacao })] }, index))) })] }), _jsxs("div", { className: styles.totalVendido, children: [_jsx("span", { children: _jsx("strong", { children: "Total:" }) }), _jsx("span", { children: new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(totalVendido) })] }), _jsxs("div", { className: styles.pagination, children: [_jsx("button", { onClick: () => paginate(currentPage - 1), disabled: currentPage === 1, className: styles.arrowButton, children: "\u2039" }), Array.from({ length: Math.ceil(salesData.length / salesPerPage) }, (_, index) => (_jsx("button", { onClick: () => paginate(index + 1), className: currentPage === index + 1 ? styles.active : "", children: index + 1 }, index))), _jsx("button", { onClick: () => paginate(currentPage + 1), disabled: currentPage === Math.ceil(salesData.length / salesPerPage), className: styles.arrowButton, children: "\u203A" })] })] }))] }) })] }) }));
}
