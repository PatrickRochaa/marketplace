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
import styles from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input/input";
import logoImg from "../../assets/logo.png";
import { Container } from "../../components/Container/container";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../services/supabaseClient"; // Importar o cliente do supabase
/*Alertas*/
import toast from "react-hot-toast";
// schema de validação do cadastro
const schema = z.object({
    nome: z
        .string()
        .min(2, "nome deve ter pelo menos 3 caracteres.")
        .min(1, "Nome é obrigatório"),
    email: z
        .string()
        .email("Insira um email válido")
        .min(1, "Email é obrigatório"),
    senha: z
        .string()
        .min(6, "Senha deve ter pelo menos 6 caracteres.")
        .min(1, "Senha é obrigatória"),
    telefone: z
        .string()
        .min(1, "O campo WhatsApp é obrigatório")
        .refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número inválido",
    }),
    endereco: z.string().min(1, "Endereço é obrigatório"),
    numero_casa: z
        .string()
        .min(1, "Número da casa deve ter pelo menos 1 caracteres.")
        .min(1, "Número da casa é obrigatório"),
    estado: z
        .string()
        .min(2, "Estado deve ter pelo menos 2 caracteres.")
        .min(1, "Estado é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    cep: z.string().min(1, "CEP é obrigatório"),
});
export function Register() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const onSubmit = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Cria o usuário no auth.users
            const { data: signUpData, error: signUpError } = yield supabase.auth.signUp({
                email: data.email,
                password: data.senha,
            });
            if (signUpError) {
                throw signUpError;
            }
            // Pega o id do usuário recém-criado
            const user = signUpData === null || signUpData === void 0 ? void 0 : signUpData.user;
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new Error("Erro ao obter o id do usuário. Tente novamente.");
            }
            // Atualiza o nome no display name do auth.users
            const { error: updateError } = yield supabase.auth.updateUser({
                data: {
                    full_name: data.nome, // Atualiza o display name
                },
            });
            if (updateError) {
                throw updateError;
            }
            // Agora cria o perfil na tabela "perfil", associando o id do auth.users
            const { error: perfilError } = yield supabase.from("perfil").insert([
                {
                    id: user.id, // Usando o id do usuário criado em auth.users
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    endereco: data.endereco,
                    numero_casa: data.numero_casa,
                    estado: data.estado,
                    cidade: data.cidade,
                    cep: data.cep,
                },
            ]);
            if (perfilError) {
                throw perfilError;
            }
            // Verifica se existem produtos no carrinho temporário
            const tempCart = JSON.parse(sessionStorage.getItem("tempCart") || "[]");
            if (tempCart.length > 0) {
                // Envia os produtos para o carrinho no banco de dados (Supabase)
                try {
                    const { error } = yield supabase.from("carrinho").upsert(tempCart.map((item) => ({
                        id_comprador: user.id,
                        nome_comprador: item.name,
                        produto_id: item.id,
                        nome_produto: item.name,
                        id_vendedor: item.user_id,
                        quantidade: item.quantity,
                        preco_unitario: item.price,
                        preco_total: item.price * item.quantity,
                    })));
                    if (error) {
                        throw new Error(error.message);
                    }
                    toast.success("Produtos adicionados ao carrinho com sucesso!");
                    sessionStorage.removeItem("tempCart"); // Limpa o carrinho temporário
                }
                catch (_a) {
                    toast.error("Erro ao restaurar produtos no carrinho.");
                }
            }
            // Exibe o toast de sucesso
            toast.success("Usuário cadastrado com sucesso!");
            // Redireciona para o dashboard após o cadastro bem-sucedido
            navigate("/dashboard");
        }
        catch (err) {
            console.error("Erro ao criar usuário:", err);
            toast.error("Erro ao criar o usuário. Tente novamente.");
        }
    });
    return (_jsxs(Container, { children: [_jsx(Link, { to: "/", children: _jsx("img", { src: logoImg, alt: "Logo do site", className: styles.imgLogin }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: styles.form, children: [_jsx("h1", { className: styles.titulo, children: "Cadastro" }), _jsx(Input, { type: "text", placeholder: "Informe seu nome", name: "nome", error: (_a = errors.nome) === null || _a === void 0 ? void 0 : _a.message, register: register }), _jsx(Input, { type: "email", placeholder: "Informe seu email", name: "email", error: (_b = errors.email) === null || _b === void 0 ? void 0 : _b.message, register: register }), _jsx(Input, { type: "password", placeholder: "Informe sua senha", name: "senha", error: (_c = errors.senha) === null || _c === void 0 ? void 0 : _c.message, register: register }), _jsx(Input, { type: "text", placeholder: "Telefone para contato", name: "telefone", error: (_d = errors.telefone) === null || _d === void 0 ? void 0 : _d.message, register: register }), _jsx(Input, { type: "text", placeholder: "Endere\u00E7o - Rua - Avenida - Logradouro", name: "endereco", error: (_e = errors.endereco) === null || _e === void 0 ? void 0 : _e.message, register: register }), _jsx(Input, { type: "text", placeholder: "N\u00BA da casa (bloco e apto, se for apartamento)", name: "numero_casa", error: (_f = errors.numero_casa) === null || _f === void 0 ? void 0 : _f.message, register: register }), _jsx(Input, { type: "text", placeholder: "Estado - Minas Gerais ou MG", name: "estado", error: (_g = errors.estado) === null || _g === void 0 ? void 0 : _g.message, register: register }), _jsx(Input, { type: "text", placeholder: "Bairro - Cidade", name: "cidade", error: (_h = errors.cidade) === null || _h === void 0 ? void 0 : _h.message, register: register }), _jsx(Input, { type: "text", placeholder: "CEP", name: "cep", error: (_j = errors.cep) === null || _j === void 0 ? void 0 : _j.message, register: register }), _jsx("button", { type: "submit", className: styles.btnRegister, children: "Cadastrar" }), _jsxs("p", { className: styles.login, children: ["J\u00E1 possui uma conta?", " ", _jsx(Link, { to: "/login", className: styles.linkLogin, children: "Fa\u00E7a login." })] })] })] }));
}
