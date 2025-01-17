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
import styles from "./dadosUser.module.css";
import { Container } from "../../../components/Container/container";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../services/supabaseClient";
import { SkeletonEntrega } from "../../../components/SkeletonEntrega/skeletonEntrega";
export function DadosEntrega({ deliveryData, setDeliveryData, setUserData, }) {
    const { user } = useAuth();
    const [userData, setUserDataState] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    /* =========================================================== */
    useEffect(() => {
        function fetchUser() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!(user === null || user === void 0 ? void 0 : user.id))
                    return;
                try {
                    const { data, error } = yield supabase
                        .from("perfil")
                        .select("*")
                        .eq("id", user.id)
                        .single();
                    if (error) {
                        throw error;
                    }
                    setUserDataState(data);
                    setUserData(data); // Passando dados de usuário para o componente pai
                    setDeliveryData({
                        nome: (data === null || data === void 0 ? void 0 : data.nome) || "",
                        endereco: (data === null || data === void 0 ? void 0 : data.endereco) || "",
                        numero_casa: (data === null || data === void 0 ? void 0 : data.numero_casa) || "",
                        estado: (data === null || data === void 0 ? void 0 : data.estado) || "",
                        cidade: (data === null || data === void 0 ? void 0 : data.cidade) || "",
                        cep: (data === null || data === void 0 ? void 0 : data.cep) || "",
                        telefone: (data === null || data === void 0 ? void 0 : data.telefone) || "", // Certifique-se de que telefone é opcional
                    });
                    setLoading(false);
                }
                catch (err) {
                    console.error("Erro ao carregar o perfil do usuário:", err);
                }
            });
        }
        fetchUser();
    }, [user === null || user === void 0 ? void 0 : user.id, setUserData, setDeliveryData]);
    /* =========================================================== */
    //fromataçao do numero de telefone
    function formatPhoneNumber(phone) {
        const phoneString = String(phone);
        const cleaned = phoneString.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        }
        return phoneString;
    }
    /* =========================================================== */
    return (_jsx(Container, { children: loading ? (_jsx(SkeletonEntrega, {})) : (_jsxs("div", { className: styles.user, children: [_jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Nome" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.nome) || (userData === null || userData === void 0 ? void 0 : userData.nome) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { nome: e.target.value })) })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Email" }), _jsx("input", { className: styles.input, value: (userData === null || userData === void 0 ? void 0 : userData.email) || "", readOnly: true })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Telefone/WhatsApp" }), _jsx("input", { className: styles.input, value: formatPhoneNumber((deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.telefone) || (userData === null || userData === void 0 ? void 0 : userData.telefone) || ""), onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { telefone: e.target.value })) })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Endere\u00E7o de Entrega" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.endereco) || (userData === null || userData === void 0 ? void 0 : userData.endereco) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { endereco: e.target.value })) })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "N\u00FAmero Casa/Apt - Bloco" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.numero_casa) || (userData === null || userData === void 0 ? void 0 : userData.numero_casa) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { numero_casa: e.target.value })) })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Estado" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.estado) || (userData === null || userData === void 0 ? void 0 : userData.estado) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { estado: e.target.value })) })] })] }), _jsxs("div", { className: styles.profileItem, children: [_jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "Bairro - Cidade" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.cidade) || (userData === null || userData === void 0 ? void 0 : userData.cidade) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { cidade: e.target.value })) })] }), _jsxs("div", { className: styles.profileDados, children: [_jsx("strong", { children: "CEP" }), _jsx("input", { className: styles.input, value: (deliveryData === null || deliveryData === void 0 ? void 0 : deliveryData.cep) || (userData === null || userData === void 0 ? void 0 : userData.cep) || "", onChange: (e) => setDeliveryData(Object.assign(Object.assign({}, deliveryData), { cep: e.target.value })) })] })] })] })) }));
}
