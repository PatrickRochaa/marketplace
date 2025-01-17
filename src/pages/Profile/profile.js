var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./profile.module.css";
import { Container } from "../../components/Container/container";
import { useAuth } from "../../context/AuthContext"; // contexto usuario
import { supabase } from "../../services/supabaseClient";
//skeleton Screen
import { Skeleton } from "../../components/SkeletonUsuario/skeletonUsuario";
export function Profile() {
    const { user, handleLogout } = useAuth(); // contexto usuário
    // Dados do usuário
    const [userData, setUserData] = useState(null);
    // Spinner de carregamento
    const [loading, setLoading] = useState(true);
    /* ================================================================= */
    useEffect(() => {
        function fetchUser() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(user === null || user === void 0 ? void 0 : user.id))
                    return; // Garantindo que o ID do usuário esteja disponível
                try {
                    setLoading(true);
                    const { data, error } = yield supabase
                        .from("perfil")
                        .select("*")
                        .eq("id", user.id) // Filtrando pelo ID do usuário logado
                        .single(); // Garantindo que apenas um resultado seja retornado
                    if (error) {
                        throw error;
                    }
                    setUserData(data);
                }
                catch (err) {
                    console.error("Erro ao carregar o perfil do usuário:", err);
                }
                finally {
                    setLoading(false);
                }
            });
        }
        fetchUser();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    /* ================================================================= */
    //formatando exibiçao whatsApp
    function formatPhoneNumber(phone) {
        const phoneString = String(phone); // Converte qualquer valor para string
        const cleaned = phoneString.replace(/\D/g, ""); // Remove caracteres não numéricos
        const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        }
        return phoneString; // Retorna o número original se não corresponder ao formato esperado
    }
    /* ================================================================= */
    return (_jsx(Container, { children: _jsxs("div", { className: styles.dashboard, children: [_jsxs("nav", { className: styles.sidebar, children: [_jsx("div", { className: styles.sidebarHeader, children: _jsx("h2", { children: "Meu Dashboard" }) }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/", children: "P\u00E1gina Inicial" }) }), _jsx("li", { children: _jsx(Link, { to: "/dashboard/new", children: "Novo Produto" }) }), _jsx("li", { children: _jsx(Link, { to: "/dashboard", children: "Dashboard" }) }), _jsx("li", { children: _jsx(Link, { to: "/cart", children: "Carrinho" }) }), _jsx("li", { children: _jsx(Link, { to: "/vendas", children: "Vendas" }) }), " ", _jsx("li", { children: _jsx(Link, { to: "/compras", children: "Compras" }) }), _jsx("li", { children: _jsx(Link, { to: "/", onClick: () => {
                                            handleLogout(); // Realiza o logout
                                        }, children: "Sair" }) })] })] }), _jsx("main", { className: styles.mainContent, children: loading ? (
                    // Usando o Skeleton para exibir o esqueleto enquanto carrega
                    _jsx(Skeleton, {})) : userData ? (
                    //Container que segura os dados do usuario
                    _jsxs("div", { className: styles.profileInfo, children: [_jsx("header", { className: styles.header, children: _jsx("h1", { children: "Meu Perfil" }) }), _jsxs("div", { className: styles.profileBorder, children: [_jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Nome" }), _jsx("input", { className: styles.input, value: userData.nome || "", readOnly: true })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Email" }), _jsx("input", { className: styles.input, value: userData.email || "", readOnly: true })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Telefone/WhatsApp" }), _jsx("input", { className: styles.input, value: formatPhoneNumber(userData.telefone || ""), readOnly: true })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Endere\u00E7o" }), _jsx("input", { className: styles.input, value: userData.endereco || "", readOnly: true })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "N: Casa/Apt - Bloco" }), _jsx("input", { className: styles.input, value: userData.numero_casa || "", readOnly: true })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Estado" }), _jsx("input", { className: styles.input, value: userData.estado || "", readOnly: true })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Cidade" }), _jsx("input", { className: styles.input, value: userData.cidade || "", readOnly: true })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "CEP" }), _jsx("input", { className: styles.input, value: userData.cep || "", readOnly: true })] })] })] })] })) : (_jsx("p", { children: "Usu\u00E1rio n\u00E3o encontrado." })) })] }) }));
}
