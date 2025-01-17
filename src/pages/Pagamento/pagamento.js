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
import styles from "./pagamento.module.css"; // css geral da pagina
//container geral
import { Container } from "../../components/Container/container";
import opcaoPagamento from "./opcaoPagamento.module.css"; // css da opçoes de pagamento
//context do usuario
import { useAuth } from "../../context/AuthContext";
//conexao com o supabase
import { supabase } from "../../services/supabaseClient";
//componente dados de entrega
import { DadosEntrega } from "./dadosUser/dadosUser";
// componente cartao de credtio
import { CartaoCredito } from "./cartaoCredito/cartaoCredito";
//componente do pix
import { Pix } from "./Pix/pix";
//componente boleto bancario
import { Boleto } from "./boleto/boleto";
//componente sumario do carrinho
import { SumarioCarrinho } from "./sumarioCarrinho/sumario";
//componente de finalizaçao da compra
import { Fim } from "./fimPagamento/fim";
//icone cartao de credito
import { BsCreditCard2Front } from "react-icons/bs";
//icone pix
import { FaPix } from "react-icons/fa6";
//icone boleto
import { FaBarcode } from "react-icons/fa";
//spinner loading
import { Spinner } from "../../components/Spinner/spinner";
import toast from "react-hot-toast"; // alertas
export function Pagamento() {
    const { user } = useAuth(); //usando usario
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [deliveryData, setDeliveryData] = useState({
        nome: "",
        endereco: "",
        numero_casa: "",
        estado: "",
        cidade: "",
        cep: "",
    });
    const [isCardValid, setIsCardValid] = useState(false);
    /* =========================================================== */
    //para o loading quando carregados dados do usario
    useEffect(() => {
        setLoading(false);
    }, [userData]);
    /* =========================================================== */
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
    const handlePaymentSelection = (method) => setPaymentMethod(method);
    /* ================================================================= */
    /* ================================================================= */
    function finalizarPedido() {
        return __awaiter(this, void 0, void 0, function* () {
            if (paymentMethod === "cartaoCredito" && !isCardValid) {
                toast.error("Preencha os dados do cartão corretamente antes de confirmar!");
                return; // Impede o envio do pedido
            }
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return; // Verifica se o usuário está autenticado
            try {
                // 1. Buscar os itens do carrinho diretamente do banco de dados
                const { data: carrinho, error: carrinhoError } = yield supabase
                    .from("carrinho")
                    .select("*")
                    .eq("id_comprador", user.id);
                if (carrinhoError)
                    throw carrinhoError;
                // 2. Agrupar os itens por vendedor
                const itensPorVendedor = carrinho.reduce((acc, item) => {
                    if (!acc[item.id_vendedor]) {
                        acc[item.id_vendedor] = [];
                    }
                    acc[item.id_vendedor].push(item);
                    return acc;
                }, {});
                // 3. Processar as transações por vendedor
                for (const vendedor_id in itensPorVendedor) {
                    const itens = itensPorVendedor[vendedor_id];
                    // 4. Calcular o valor total para esse vendedor
                    const total = itens.reduce((acc, item) => acc + item.preco_total, 0);
                    // 5. Criar a transação para o vendedor
                    const { error: transacaoError } = yield supabase
                        .from("transacoes")
                        .insert([
                        {
                            comprador_id: user.id,
                            vendedor_id: vendedor_id,
                            itens: itens.map((item) => ({
                                produto_id: item.produto_id,
                                quantidade: item.quantidade,
                                preco_unitario: item.preco_unitario,
                                preco_total: item.preco_total,
                                nome_produto: item.nome_produto,
                            })),
                            total: total,
                        },
                    ])
                        .single();
                    if (transacaoError)
                        throw transacaoError;
                    // 6. Remover os itens do carrinho para esse vendedor
                    yield supabase
                        .from("carrinho")
                        .delete()
                        .eq("id_comprador", user.id)
                        .eq("id_vendedor", vendedor_id);
                }
                // 7. Exibir confirmação de sucesso
                setStep(4); // Exibir confirmação de que o pedido foi finalizado
            }
            catch (error) {
                console.error("Erro ao finalizar o pedido:", error);
            }
        });
    }
    /* ================================================================= */
    return (_jsx(Container, { children: loading ? (
        // Usando o Spinner ao invés do código duplicado
        _jsx(Spinner, { message: "Carregando dados..." })) : (_jsxs("div", { className: styles.container, children: [_jsx("div", { className: styles.steps, children: [1, 2, 3, 4].map((num) => (_jsxs("div", { className: `${styles.step} ${num === step ? styles.active : ""}`, children: [_jsx("div", { className: styles.circle, children: num }), _jsx("span", { className: styles.label, children: num === 1
                                    ? "Entrega"
                                    : num === 2
                                        ? "Forma de pagamento"
                                        : num === 3
                                            ? "Pagamento"
                                            : "Fim" }), num !== 4 && _jsx("div", { className: styles.line })] }, num))) }), step === 1 && (_jsxs("div", { children: [_jsx("h2", { className: styles.title, children: "Endere\u00E7o de Entrega" }), _jsx(DadosEntrega, { deliveryData: deliveryData, setDeliveryData: setDeliveryData, setUserData: setUserData }), _jsx("button", { onClick: nextStep, className: styles.button, children: "Pr\u00F3ximo" })] })), step === 2 && (_jsxs("div", { children: [_jsx("h2", { children: "Escolha a Forma de Pagamento" }), _jsxs("div", { className: opcaoPagamento.paymentOptions, children: [_jsxs("div", { className: `${opcaoPagamento.paymentOption} ${paymentMethod === "cartaoCredito"
                                        ? opcaoPagamento.selected
                                        : ""}`, onClick: () => handlePaymentSelection("cartaoCredito"), children: [_jsx(BsCreditCard2Front, { size: 40, color: "#333" }), _jsx("span", { children: "Cart\u00E3o de Cr\u00E9dito" })] }), _jsxs("div", { className: `${opcaoPagamento.paymentOption} ${paymentMethod === "pix" ? opcaoPagamento.selected : ""}`, onClick: () => handlePaymentSelection("pix"), children: [_jsx(FaPix, { size: 40, color: "#333" }), _jsx("span", { children: "PIX" })] }), _jsxs("div", { className: `${opcaoPagamento.paymentOption} ${paymentMethod === "boletoBancario"
                                        ? opcaoPagamento.selected
                                        : ""}`, onClick: () => handlePaymentSelection("boletoBancario"), children: [_jsx(FaBarcode, { size: 40, color: "#333" }), _jsx("span", { children: "Boleto banc\u00E1rio" })] })] }), _jsxs("div", { className: styles.buttons, children: [_jsx("button", { onClick: prevStep, className: styles.button, children: "Voltar" }), _jsx("button", { onClick: nextStep, className: `${styles.button} ${!paymentMethod ? styles.disabled : ""}`, disabled: !paymentMethod, children: "Pr\u00F3ximo" })] })] })), step === 3 && (_jsxs("div", { children: [_jsx("h2", { className: styles.title, children: "Resumo do Pedido" }), _jsx("h3", { children: "Itens do Carrinho:" }), _jsx(SumarioCarrinho, { deliveryData: deliveryData, userData: userData }), _jsxs("div", { className: styles.paymentDetails, children: [_jsx("h3", { className: styles.title2, children: "Detalhes de Pagamento:" }), paymentMethod === "cartaoCredito" && (_jsx(CartaoCredito, { isCardValid: isCardValid, setIsCardValid: setIsCardValid })), paymentMethod === "pix" && _jsx(Pix, {}), paymentMethod === "boletoBancario" && _jsx(Boleto, {})] }), _jsxs("div", { className: styles.buttons, children: [_jsx("button", { onClick: prevStep, className: styles.button, children: "Voltar" }), _jsx("button", { onClick: finalizarPedido, className: `${styles.button} ${paymentMethod === "cartaoCredito" && !isCardValid
                                        ? styles.disabled
                                        : ""}`, children: "Confirmar Pedido" })] })] })), step === 4 && (_jsxs("div", { children: [_jsx("h2", { className: styles.title, children: "Pedido Confirmado" }), _jsx(Fim, {})] })), _jsx("p", { style: {
                        color: "red",
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginTop: "10px",
                    }, children: "ATEN\u00C7\u00C3O: Este \u00E9 um ambiente de pagamento simulado. Nenhuma transa\u00E7\u00E3o real ser\u00E1 realizada. O processo \u00E9 apenas para fins de estudo e demonstra\u00E7\u00E3o." })] })) }));
}
