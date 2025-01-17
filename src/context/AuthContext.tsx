import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { supabase } from "../services/supabaseClient";
import { ProductProps } from "../types/products";
import toast from "react-hot-toast"; // alertas

// Tipos e interface para o contexto
interface AuthContextData {
  user: UserProps | null; // Dados do usuário logado
  signed: boolean; // Indica se o usuário está autenticado
  loadingAuth: boolean; // Estado de carregamento da autenticação
  loadingProducts: boolean; // Estado de carregamento dos produtos
  products: ProductProps[]; // Lista de produtos do usuário
  handleInfoUser: (user: UserProps) => void; // Atualiza informações do usuário
  handleLogout: () => void; // Realiza o logout
  updateProducts: (newProduct: ProductProps) => void; // Adiciona um novo produto
}

// Estrutura dos dados do usuário
interface UserProps {
  id: string; // ID único do usuário
  name: string | null; // Nome completo do usuário
  email: string | null; // Email do usuário
  telefone: string | null; // Telefone do usuário
}

// Criando o contexto
export const AuthContext = createContext({} as AuthContextData);

// Tipos para o componente provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null); // Estado do usuário
  const [loadingAuth, setLoadingAuth] = useState(true); // Carregando autenticação
  const [products, setProducts] = useState<ProductProps[]>([]); // Produtos do usuário
  const [loadingProducts, setLoadingProducts] = useState(false); // Carregando produtos

  /* =============================================================== */

  // Verifica a sessão ativa ao carregar a aplicação
  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || null,
            email: session.user.email || null,
            telefone: session.user.user_metadata.phone || null,
          });
        }
      } catch (err) {
        console.error("Erro ao verificar o usuário:", err);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkUser();

    // Ouvinte de mudanças na autenticação
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || null,
            email: session.user.email || null,
            telefone: session.user.user_metadata.phone || null,
          });
        } else {
          setUser(null); // Se não houver usuário, limpa o estado
        }
      }
    );

    // Garantir que o listener seja removido corretamente ao desmontar o componente
    return () => {
      authSubscription.subscription?.unsubscribe?.();
    };
  }, []);

  /* =============================================================== */

  // Carrega produtos do usuário autenticado
  useEffect(() => {
    async function fetchProducts() {
      if (!user) return;

      try {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw new Error(error.message);
        setProducts(data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [user]);

  /* =============================================================== */

  // Atualiza as informações do usuário
  const handleInfoUser = (userData: UserProps) => {
    setUser(userData);
  };

  /* =============================================================== */

  // Realiza logout do usuário
  const handleLogout = async () => {
    try {
      // Realiza o logout do Supabase
      await supabase.auth.signOut();

      // Limpa o estado de usuário na aplicação
      setUser(null);

      // Limpa todos os dados do sessionStorage
      sessionStorage.clear(); // Remove todas as chaves do sessionStorage

      // Opcional: Forçar a atualização da sessão
      const { error } = await supabase.auth.getSession();
      toast.success("Voce saiu! Até breve!");
      if (error) {
        // console.error("Erro ao atualizar a sessão:", error.message);
      } else {
        // console.log("Sessão após logout:", session);
      }
    } catch {
      // console.error("Erro ao deslogar:", err);
    }
  };

  /* =============================================================== */

  // Adiciona um novo produto à lista de produtos do usuário
  const updateProducts = (newProduct: ProductProps) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Define se o usuário está autenticado
  const signed = !!user;

  /* =============================================================== */
  return (
    <AuthContext.Provider
      value={{
        user,
        signed,
        loadingAuth,
        loadingProducts,
        products,
        handleInfoUser,
        handleLogout,
        updateProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// **Adicione o hook useAuth abaixo** para acessar o contexto em outros componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
