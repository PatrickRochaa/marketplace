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
import { createContext, useState, useEffect, useContext, } from "react";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast"; // alertas
// Criando o contexto
export const AuthContext = createContext({});
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Estado do usuário
    const [loadingAuth, setLoadingAuth] = useState(true); // Carregando autenticação
    const [products, setProducts] = useState([]); // Produtos do usuário
    const [loadingProducts, setLoadingProducts] = useState(false); // Carregando produtos
    /* =============================================================== */
    // Verifica a sessão ativa ao carregar a aplicação
    useEffect(() => {
        function checkUser() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { data: { session }, error, } = yield supabase.auth.getSession();
                    if (error)
                        throw new Error(error.message);
                    if (session === null || session === void 0 ? void 0 : session.user) {
                        setUser({
                            id: session.user.id,
                            name: session.user.user_metadata.full_name || null,
                            email: session.user.email || null,
                            telefone: session.user.user_metadata.phone || null,
                        });
                    }
                }
                catch (err) {
                    console.error("Erro ao verificar o usuário:", err);
                }
                finally {
                    setLoadingAuth(false);
                }
            });
        }
        checkUser();
        // Ouvinte de mudanças na autenticação
        const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session === null || session === void 0 ? void 0 : session.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || null,
                    email: session.user.email || null,
                    telefone: session.user.user_metadata.phone || null,
                });
            }
            else {
                setUser(null); // Se não houver usuário, limpa o estado
            }
        });
        // Garantir que o listener seja removido corretamente ao desmontar o componente
        return () => {
            var _a, _b;
            (_b = (_a = authSubscription.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
    }, []);
    /* =============================================================== */
    // Carrega produtos do usuário autenticado
    useEffect(() => {
        function fetchProducts() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!user)
                    return;
                try {
                    setLoadingProducts(true);
                    const { data, error } = yield supabase
                        .from("products")
                        .select("*")
                        .eq("user_id", user.id);
                    if (error)
                        throw new Error(error.message);
                    setProducts(data || []);
                }
                catch (err) {
                    console.error("Erro ao carregar produtos:", err);
                }
                finally {
                    setLoadingProducts(false);
                }
            });
        }
        fetchProducts();
    }, [user]);
    /* =============================================================== */
    // Atualiza as informações do usuário
    const handleInfoUser = (userData) => {
        setUser(userData);
    };
    /* =============================================================== */
    // Realiza logout do usuário
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // Realiza o logout do Supabase
            yield supabase.auth.signOut();
            // Limpa o estado de usuário na aplicação
            setUser(null);
            // Limpa todos os dados do sessionStorage
            sessionStorage.clear(); // Remove todas as chaves do sessionStorage
            // Opcional: Verifica apenas se houve erro na sessão
            const { error } = yield supabase.auth.getSession();
            if (error) {
                console.error("Erro ao atualizar a sessão:", error.message);
            }
            toast.success("Você saiu! Até breve!");
        }
        catch (_a) {
            //console.error("Erro ao deslogar:", err);
        }
    });
    /* =============================================================== */
    // Adiciona um novo produto à lista de produtos do usuário
    const updateProducts = (newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };
    // Define se o usuário está autenticado
    const signed = !!user;
    /* =============================================================== */
    return (_jsx(AuthContext.Provider, { value: {
            user,
            signed,
            loadingAuth,
            loadingProducts,
            products,
            handleInfoUser,
            handleLogout,
            updateProducts,
        }, children: children }));
}
// **Adicione o hook useAuth abaixo** para acessar o contexto em outros componentes
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
