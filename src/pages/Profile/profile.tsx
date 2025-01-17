import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./profile.module.css";
import { Container } from "../../components/Container/container";
import { useAuth } from "../../context/AuthContext"; // contexto usuario

import { supabase } from "../../services/supabaseClient";

//skeleton Screen
import { Skeleton } from "../../components/SkeletonUsuario/skeletonUsuario";

// Interface para os dados do usuário
export interface UserData {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  numero_casa: string;
  estado: string;
  cidade: string;
  cep: string;
}

export function Profile() {
  const { user, handleLogout } = useAuth(); // contexto usuário

  // Dados do usuário
  const [userData, setUserData] = useState<UserData | null>(null);

  // Spinner de carregamento
  const [loading, setLoading] = useState(true);

  /* ================================================================= */

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) return; // Garantindo que o ID do usuário esteja disponível

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("perfil")
          .select("*")
          .eq("id", user.id) // Filtrando pelo ID do usuário logado
          .single(); // Garantindo que apenas um resultado seja retornado

        if (error) {
          throw error;
        }
        setUserData(data);
      } catch (err) {
        console.error("Erro ao carregar o perfil do usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user?.id]);

  /* ================================================================= */

  //formatando exibiçao whatsApp
  function formatPhoneNumber(phone: string | number): string {
    const phoneString = String(phone); // Converte qualquer valor para string
    const cleaned = phoneString.replace(/\D/g, ""); // Remove caracteres não numéricos
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }

    return phoneString; // Retorna o número original se não corresponder ao formato esperado
  }

  /* ================================================================= */

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
              <Link to="/dashboard/new">Novo Produto</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/cart">Carrinho</Link>
            </li>
            <li>
              <Link to="/vendas">Vendas</Link>
            </li>{" "}
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
          {loading ? (
            // Usando o Skeleton para exibir o esqueleto enquanto carrega
            <Skeleton />
          ) : userData ? (
            //Container que segura os dados do usuario
            <div className={styles.profileInfo}>
              <header className={styles.header}>
                <h1>Meu Perfil</h1>
              </header>
              <div className={styles.profileBorder}>
                <div className={styles.profileItem}>
                  <div className={styles.profileDados}>
                    <strong>Nome</strong>
                    <input
                      className={styles.input}
                      value={userData.nome || ""}
                      readOnly
                    />
                  </div>
                  <div className={styles.profileDados}>
                    <strong>Email</strong>
                    <input
                      className={styles.input}
                      value={userData.email || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.profileItem}>
                  <div className={styles.profileDados}>
                    <strong>Telefone/WhatsApp</strong>
                    <input
                      className={styles.input}
                      value={formatPhoneNumber(userData.telefone || "")}
                      readOnly
                    />
                  </div>
                  <div className={styles.profileDados}>
                    <strong>Endereço</strong>
                    <input
                      className={styles.input}
                      value={userData.endereco || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className={styles.profileItem}>
                  <div className={styles.profileDados}>
                    <strong>N: Casa/Apt - Bloco</strong>
                    <input
                      className={styles.input}
                      value={userData.numero_casa || ""}
                      readOnly
                    />
                  </div>
                  <div className={styles.profileDados}>
                    <strong>Estado</strong>
                    <input
                      className={styles.input}
                      value={userData.estado || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className={styles.profileItem}>
                  <div className={styles.profileDados}>
                    <strong>Cidade</strong>
                    <input
                      className={styles.input}
                      value={userData.cidade || ""}
                      readOnly
                    />
                  </div>
                  <div className={styles.profileDados}>
                    <strong>CEP</strong>
                    <input
                      className={styles.input}
                      value={userData.cep || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Usuário não encontrado.</p>
          )}
        </main>
      </div>
    </Container>
  );
}
