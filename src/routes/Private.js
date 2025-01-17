var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom"; // Hook para navegação entre páginas
import { supabase } from "../services/supabaseClient"; // Importa o cliente do Supabase para autenticação
import { useEffect, useState } from "react"; // ReactNode para tipagem e hooks para controle de estado e efeitos
// Componente que protege uma rota
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate(); // Hook para redirecionar o usuário para outra rota
    const [loading, setLoading] = useState(true); // Estado que indica se o carregamento está em andamento
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado que indica se o usuário está autenticado
    // Efeito que verifica a sessão do usuário ao carregar o componente
    useEffect(() => {
        const checkUser = () => __awaiter(void 0, void 0, void 0, function* () {
            // Obtém a sessão atual do Supabase
            const { data: { session }, error, } = yield supabase.auth.getSession();
            // Exibe um erro no console se houver problemas ao obter a sessão
            if (error) {
                console.error("Erro ao verificar sessão:", error.message);
            }
            // Verifica se a sessão contém um usuário autenticado
            if (session === null || session === void 0 ? void 0 : session.user) {
                setIsAuthenticated(true); // Atualiza o estado para indicar que o usuário está autenticado
            }
            else {
                setIsAuthenticated(false); // Indica que o usuário não está autenticado
                navigate("/login"); // Redireciona para a página de login
            }
            setLoading(false); // Finaliza o estado de carregamento
        });
        checkUser(); // Chama a função para verificar o usuário
    }, [navigate]); // Reexecuta o efeito se o `navigate` mudar (geralmente desnecessário)
    // Enquanto o estado de carregamento for `true`, exibe um componente de carregamento
    if (loading) {
        return _jsx("div", { children: "Carregando..." });
    }
    // Se o usuário estiver autenticado, renderiza os filhos do componente;
    // caso contrário, retorna `null` (não exibe nada)
    return isAuthenticated ? children : null;
};
export default ProtectedRoute;
