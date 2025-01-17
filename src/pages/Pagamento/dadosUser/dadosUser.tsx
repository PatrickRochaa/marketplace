import { useState, useEffect } from "react";
import styles from "./dadosUser.module.css";
import { Container } from "../../../components/Container/container";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../services/supabaseClient";
import { UserData } from "../../Profile/profile";
import { SkeletonEntrega } from "../../../components/SkeletonEntrega/skeletonEntrega";

// Defina as interfaces para os dados passados como props
interface DeliveryData {
  nome: string;
  endereco: string;
  numero_casa: string;
  estado: string;
  cidade: string;
  cep: string;
  telefone?: string | number; // telefone é opcional se não estiver incluído
}

interface DadosEntregaProps {
  deliveryData: DeliveryData;
  setDeliveryData: React.Dispatch<React.SetStateAction<DeliveryData>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export function DadosEntrega({
  deliveryData,
  setDeliveryData,
  setUserData,
}: DadosEntregaProps) {
  const { user } = useAuth();
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  /* =========================================================== */

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
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
          nome: data?.nome || "",
          endereco: data?.endereco || "",
          numero_casa: data?.numero_casa || "",
          estado: data?.estado || "",
          cidade: data?.cidade || "",
          cep: data?.cep || "",
          telefone: data?.telefone || "", // Certifique-se de que telefone é opcional
        });
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar o perfil do usuário:", err);
      }
    }

    fetchUser();
  }, [user?.id, setUserData, setDeliveryData]);

  /* =========================================================== */
  //fromataçao do numero de telefone
  function formatPhoneNumber(phone: string | number): string {
    const phoneString = String(phone);
    const cleaned = phoneString.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }

    return phoneString;
  }

  /* =========================================================== */

  return (
    <Container>
      {loading ? (
        <SkeletonEntrega />
      ) : (
        <div className={styles.user}>
          <div className={styles.profileItem}>
            <div className={styles.profileDados}>
              <strong>Nome</strong>
              <input
                className={styles.input}
                value={deliveryData?.nome || userData?.nome || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    nome: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.profileDados}>
              <strong>Email</strong>
              <input
                className={styles.input}
                value={userData?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className={styles.profileItem}>
            <div className={styles.profileDados}>
              <strong>Telefone/WhatsApp</strong>
              <input
                className={styles.input}
                value={formatPhoneNumber(
                  deliveryData?.telefone || userData?.telefone || ""
                )}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    telefone: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.profileDados}>
              <strong>Endereço de Entrega</strong>
              <input
                className={styles.input}
                value={deliveryData?.endereco || userData?.endereco || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    endereco: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className={styles.profileItem}>
            <div className={styles.profileDados}>
              <strong>Número Casa/Apt - Bloco</strong>
              <input
                className={styles.input}
                value={deliveryData?.numero_casa || userData?.numero_casa || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    numero_casa: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.profileDados}>
              <strong>Estado</strong>
              <input
                className={styles.input}
                value={deliveryData?.estado || userData?.estado || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    estado: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className={styles.profileItem}>
            <div className={styles.profileDados}>
              <strong>Bairro - Cidade</strong>
              <input
                className={styles.input}
                value={deliveryData?.cidade || userData?.cidade || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    cidade: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.profileDados}>
              <strong>CEP</strong>
              <input
                className={styles.input}
                value={deliveryData?.cep || userData?.cep || ""}
                onChange={(e) =>
                  setDeliveryData({
                    ...deliveryData,
                    cep: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
