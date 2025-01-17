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
import { Container } from "../../components/Container/container";
import { useEffect } from "react";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input/input";
import logoImg from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../services/supabaseClient";
/*Alertas*/
import toast from "react-hot-toast";
// schema de validação do login
const schema = z.object({
    email: z
        .string()
        .email("Insira um email válido")
        .min(1, "Email é obrigatório"),
    password: z
        .string()
        .min(6, "Senha deve ter pelo menos 6 caracteres.")
        .min(1, "Senha é obrigatória"),
});
export function Login() {
    var _a, _b;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    // Função que será chamada no submit do formulário
    // Ao submeter o formulário
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        const { email, password } = data;
        try {
            const { data: authData, error: authError } = yield supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError) {
                toast.error("Email ou senha inválidos. Tente novamente.");
                return;
            }
            const user = authData === null || authData === void 0 ? void 0 : authData.user;
            if (user) {
                sessionStorage.setItem("user", JSON.stringify(user));
                toast.success("Login realizado com sucesso!");
                navigate("/"); // Redireciona para a página inicial
            }
            else {
                toast.error("Erro inesperado ao autenticar. Tente novamente.");
            }
        }
        catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error("Erro ao tentar realizar login.");
        }
    });
    // Verifica se o usuário está logado
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        // Só redireciona se os dados forem válidos
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user) {
                    navigate("/"); // Redireciona para a home
                }
            }
            catch (err) {
                console.error("Erro ao ler o sessionStorage:", err);
                sessionStorage.removeItem("user"); // Limpa dados inválidos
            }
        }
    }, [navigate]);
    return (_jsxs(Container, { children: [_jsx(Link, { to: "/", children: _jsx("img", { src: logoImg, alt: "Logo do site", className: styles.imgLogin }) }), _jsxs("form", { className: styles.form, onSubmit: handleSubmit(onSubmit), children: [_jsx("h1", { className: styles.titulo, children: "Login" }), _jsx(Input, { type: "email", placeholder: "Informe seu email", name: "email", error: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message, register: register }), _jsx(Input, { type: "password", placeholder: "Informe sua senha", name: "password", error: (_b = errors.password) === null || _b === void 0 ? void 0 : _b.message, register: register }), _jsx("button", { type: "submit", className: styles.btnRegister, children: "Entrar" }), _jsxs("p", { className: styles.login, children: ["Ainda n\u00E3o possui uma conta?", " ", _jsx(Link, { to: "/register", className: styles.linkLogin, children: _jsx("strong", { children: "Cadastre-se." }) })] })] })] }));
}
