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

// Tipagem para os dados de vendas
type Sale = {
  nome_produto: string;
  quantidade: number;
  preco: number;
  data_transacao: string;
};

type Transaction = {
  data_transacao: string;
  itens: Item[];
};

type Item = {
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
};

export function Vendas() {
  const { handleLogout, user } = useAuth(); // contexto usuário

  // Tipando o estado salesData como um array de objetos Sale
  const [salesData, setSalesData] = useState<Sale[]>([]); // Para armazenar as vendas
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all"); // Padrão: últimos 10 dias
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [totalVendido, setTotalVendido] = useState<number>(0); // Estado para o total vendido

  // Adicionando estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(4); // Definindo o número de compras por página

  // Função para buscar transações do usuário autenticado
  async function fetchSales(period: string) {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Busca as transações do comprador filtradas pelo período
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq("vendedor_id", user.id)
        .order("data_transacao", { ascending: false });

      if (error) throw error;

      // Converte e filtra os dados conforme o período
      const filteredData =
        data?.filter((transaction: Transaction) => {
          // Se o período for "all", não aplica nenhum filtro de data
          if (period === "all") {
            return true; // Retorna todas as transações
          }

          const transactionDate = new Date(transaction.data_transacao);
          const now = new Date();
          const diffInDays =
            (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);

          return diffInDays <= parseInt(period);
        }) ?? [];

      /* ============================================================== */

      // Atualiza o estado com as transações
      const sales = filteredData.flatMap((transaction: Transaction) => {
        return transaction.itens.map((item: Item) => {
          // Formatação da data no formato dia/mês/ano
          const formattedDate = new Date(
            transaction.data_transacao
          ).toLocaleDateString("pt-BR");

          return {
            nome_produto: item.nome_produto, // Exibe o nome do produto
            quantidade: item.quantidade,
            preco: item.preco_unitario, // Ajuste conforme o seu banco
            data_transacao: formattedDate, // Use a data formatada
          };
        });
      });

      // Calcular o total vendido
      const total = sales.reduce(
        (acc, sale) => acc + sale.quantidade * sale.preco,
        0
      );
      setTotalVendido(total);

      setSalesData(sales);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  /* ============================================================== */

  // Busca as vendas ao alterar o período ou ao carregar a página
  useEffect(() => {
    fetchSales(selectedPeriod);
  }, [selectedPeriod, user?.id]);

  /* ============================================================== */

  // Função para mudar de página
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) pageNumber = 1; // Garante que a página não seja menor que 1
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

  return (
    <Container>
      <div className={styles.dashboard}>
        <nav className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Meu Dashboard</h2>
          </div>
          <ul>
            <li>
              <Link to="/">Página Inicial</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/new">Novo Produto</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
            <li>
              <Link to="/cart">Carrinho</Link>
            </li>
            <li>
              <Link to="/compras">Compras</Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  handleLogout(); // Realiza o logout
                }}
              >
                Sair
              </Link>
            </li>
          </ul>
        </nav>

        <main className={styles.mainContent}>
          <section className={styles.salesTableContainer}>
            <h1 className={styles.title}>Vendas Realizadas</h1>

            {/* Sempre visível: Filtro de período */}
            <Periodo
              selectedPeriod={selectedPeriod}
              onChange={setSelectedPeriod}
            />

            {loading ? (
              <Spinner message="Carregando Compras..." />
            ) : salesData.length === 0 ? (
              <>
                <p className={styles.alert}>
                  Nenhuma compra foi realizada no período selecionado.
                </p>
                <BotaoHome />
              </>
            ) : (
              <>
                <table className={styles.salesTable}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Itens</th>
                      <th>Preço Unitário</th>
                      <th>Total</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData
                      .slice(
                        (currentPage - 1) * salesPerPage,
                        currentPage * salesPerPage
                      )
                      .map((sale, index) => (
                        <tr key={index}>
                          <td>{sale.nome_produto}</td>
                          <td>{sale.quantidade}</td>
                          <td>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(sale.preco)}
                          </td>
                          <td>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(sale.quantidade * sale.preco)}
                          </td>
                          <td>{sale.data_transacao}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {/* Total das Compras*/}
                <div className={styles.totalVendido}>
                  <span>
                    <strong>Total:</strong>
                  </span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalVendido)}
                  </span>
                </div>

                {/* Paginação */}
                <div className={styles.pagination}>
                  {/* Botão de Voltar */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.arrowButton}
                  >
                    ‹
                  </button>

                  {Array.from(
                    { length: Math.ceil(salesData.length / salesPerPage) },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={
                          currentPage === index + 1 ? styles.active : ""
                        }
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  {/* Botão de Avançar */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(salesData.length / salesPerPage)
                    }
                    className={styles.arrowButton}
                  >
                    ›
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </Container>
  );
}
