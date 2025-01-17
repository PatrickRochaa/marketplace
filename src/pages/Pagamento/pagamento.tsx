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

//interface do usuario
import { UserData } from "../Profile/profile";

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
  const [userData, setUserData] = useState<UserData | null>(null);
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
  const handlePaymentSelection = (
    method: "cartaoCredito" | "pix" | "boletoBancario"
  ) => setPaymentMethod(method);

  /* ================================================================= */

  /* ================================================================= */

  async function finalizarPedido() {
    if (paymentMethod === "cartaoCredito" && !isCardValid) {
      toast.error(
        "Preencha os dados do cartão corretamente antes de confirmar!"
      );
      return; // Impede o envio do pedido
    }

    if (!user?.id) return; // Verifica se o usuário está autenticado

    try {
      // 1. Buscar os itens do carrinho diretamente do banco de dados
      const { data: carrinho, error: carrinhoError } = await supabase
        .from("carrinho")
        .select("*")
        .eq("id_comprador", user.id);

      if (carrinhoError) throw carrinhoError;

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
        const { error: transacaoError } = await supabase
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

        if (transacaoError) throw transacaoError;

        // 6. Remover os itens do carrinho para esse vendedor
        await supabase
          .from("carrinho")
          .delete()
          .eq("id_comprador", user.id)
          .eq("id_vendedor", vendedor_id);
      }

      // 7. Exibir confirmação de sucesso
      setStep(4); // Exibir confirmação de que o pedido foi finalizado
    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
    }
  }

  /* ================================================================= */

  return (
    <Container>
      {loading ? (
        // Usando o Spinner ao invés do código duplicado
        <Spinner message="Carregando dados..." />
      ) : (
        <div className={styles.container}>
          <div className={styles.steps}>
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`${styles.step} ${
                  num === step ? styles.active : ""
                }`}
              >
                <div className={styles.circle}>{num}</div>
                <span className={styles.label}>
                  {num === 1
                    ? "Entrega"
                    : num === 2
                    ? "Forma de pagamento"
                    : num === 3
                    ? "Pagamento"
                    : "Fim"}
                </span>
                {num !== 4 && <div className={styles.line}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className={styles.title}>Endereço de Entrega</h2>
              <DadosEntrega
                deliveryData={deliveryData}
                setDeliveryData={setDeliveryData}
                setUserData={setUserData} // Passando a função para setar dados do usuário
              />
              <button onClick={nextStep} className={styles.button}>
                Próximo
              </button>
            </div>
          )}

          {/* Step 2 - Escolha da forma de pagamento */}
          {step === 2 && (
            <div>
              <h2>Escolha a Forma de Pagamento</h2>
              <div className={opcaoPagamento.paymentOptions}>
                <div
                  className={`${opcaoPagamento.paymentOption} ${
                    paymentMethod === "cartaoCredito"
                      ? opcaoPagamento.selected
                      : ""
                  }`}
                  onClick={() => handlePaymentSelection("cartaoCredito")}
                >
                  <BsCreditCard2Front size={40} color="#333" />

                  <span>Cartão de Crédito</span>
                </div>
                <div
                  className={`${opcaoPagamento.paymentOption} ${
                    paymentMethod === "pix" ? opcaoPagamento.selected : ""
                  }`}
                  onClick={() => handlePaymentSelection("pix")}
                >
                  <FaPix size={40} color="#333" />
                  <span>PIX</span>
                </div>
                <div
                  className={`${opcaoPagamento.paymentOption} ${
                    paymentMethod === "boletoBancario"
                      ? opcaoPagamento.selected
                      : ""
                  }`}
                  onClick={() => handlePaymentSelection("boletoBancario")}
                >
                  <FaBarcode size={40} color="#333" />
                  <span>Boleto bancário</span>
                </div>
              </div>
              <div className={styles.buttons}>
                <button onClick={prevStep} className={styles.button}>
                  Voltar
                </button>
                <button
                  onClick={nextStep}
                  className={`${styles.button} ${
                    !paymentMethod ? styles.disabled : ""
                  }`}
                  disabled={!paymentMethod} // Desabilita o botão se nenhuma opção estiver selecionada
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Resumo do Pedido */}
          {step === 3 && (
            <div>
              <h2 className={styles.title}>Resumo do Pedido</h2>

              <h3>Itens do Carrinho:</h3>
              <SumarioCarrinho
                deliveryData={deliveryData}
                userData={userData}
              />
              {/* Lista de itens no carrinho */}

              {/* Campos de pagamento dinâmicos */}
              <div className={styles.paymentDetails}>
                <h3 className={styles.title2}>Detalhes de Pagamento:</h3>

                {/* Cartão de Crédito */}
                {paymentMethod === "cartaoCredito" && (
                  <CartaoCredito
                    isCardValid={isCardValid}
                    setIsCardValid={setIsCardValid}
                  />
                )}

                {/* PIX */}
                {paymentMethod === "pix" && <Pix />}

                {/*Boleto Bancário */}
                {paymentMethod === "boletoBancario" && <Boleto />}
              </div>

              {/* Botões de navegação */}
              <div className={styles.buttons}>
                <button onClick={prevStep} className={styles.button}>
                  Voltar
                </button>
                <button
                  onClick={finalizarPedido}
                  className={`${styles.button} ${
                    paymentMethod === "cartaoCredito" && !isCardValid
                      ? styles.disabled
                      : ""
                  }`}
                >
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Confirmação */}
          {step === 4 && (
            <div>
              <h2 className={styles.title}>Pedido Confirmado</h2>
              <Fim />
            </div>
          )}
          <p
            style={{
              color: "red",
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            ATENÇÃO: Este é um ambiente de pagamento simulado. Nenhuma transação
            real será realizada. O processo é apenas para fins de estudo e
            demonstração.
          </p>
        </div>
      )}
    </Container>
  );
}
