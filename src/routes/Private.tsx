import { useNavigate } from "react-router-dom"; // Hook para navegação entre páginas
import { supabase } from "../services/supabaseClient"; // Importa o cliente do Supabase para autenticação
import { ReactNode, useEffect, useState } from "react"; // ReactNode para tipagem e hooks para controle de estado e efeitos

// Define as propriedades esperadas para o componente de rota protegida
interface PrivateProps {
  children: ReactNode; // O componente filho que será renderizado se o usuário estiver autenticado
}

// Componente que protege uma rota
const ProtectedRoute = ({ children }: PrivateProps): any => {
  const navigate = useNavigate(); // Hook para redirecionar o usuário para outra rota
  const [loading, setLoading] = useState(true); // Estado que indica se o carregamento está em andamento
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado que indica se o usuário está autenticado

  // Efeito que verifica a sessão do usuário ao carregar o componente
  useEffect(() => {
    const checkUser = async () => {
      // Obtém a sessão atual do Supabase
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // Exibe um erro no console se houver problemas ao obter a sessão
      if (error) {
        console.error("Erro ao verificar sessão:", error.message);
      }

      // Verifica se a sessão contém um usuário autenticado
      if (session?.user) {
        setIsAuthenticated(true); // Atualiza o estado para indicar que o usuário está autenticado
      } else {
        setIsAuthenticated(false); // Indica que o usuário não está autenticado
        navigate("/login"); // Redireciona para a página de login
      }

      setLoading(false); // Finaliza o estado de carregamento
    };

    checkUser(); // Chama a função para verificar o usuário
  }, [navigate]); // Reexecuta o efeito se o `navigate` mudar (geralmente desnecessário)

  // Enquanto o estado de carregamento for `true`, exibe um componente de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se o usuário estiver autenticado, renderiza os filhos do componente;
  // caso contrário, retorna `null` (não exibe nada)
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
