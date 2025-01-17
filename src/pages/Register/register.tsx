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

//tipagem para o formulário seguir o schema de validação
type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Cria o usuário no auth.users
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.senha,
        });

      if (signUpError) {
        throw signUpError;
      }

      // Pega o id do usuário recém-criado
      const user = signUpData?.user;

      if (!user?.id) {
        throw new Error("Erro ao obter o id do usuário. Tente novamente.");
      }

      // Atualiza o nome no display name do auth.users
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: data.nome, // Atualiza o display name
        },
      });

      if (updateError) {
        throw updateError;
      }

      // Agora cria o perfil na tabela "perfil", associando o id do auth.users
      const { error: perfilError } = await supabase.from("perfil").insert([
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
          const { error } = await supabase.from("carrinho").upsert(
            tempCart.map((item) => ({
              id_comprador: user.id,
              nome_comprador: item.name,
              produto_id: item.id,
              nome_produto: item.name,
              id_vendedor: item.user_id,
              quantidade: item.quantity,
              preco_unitario: item.price,
              preco_total: item.price * item.quantity,
            }))
          );

          if (error) {
            throw new Error(error.message);
          }

          toast.success("Produtos adicionados ao carrinho com sucesso!");
          sessionStorage.removeItem("tempCart"); // Limpa o carrinho temporário
        } catch {
          toast.error("Erro ao restaurar produtos no carrinho.");
        }
      }

      // Exibe o toast de sucesso
      toast.success("Usuário cadastrado com sucesso!");

      // Redireciona para o dashboard após o cadastro bem-sucedido
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      toast.error("Erro ao criar o usuário. Tente novamente.");
    }
  };

  return (
    <Container>
      <Link to="/">
        <img src={logoImg} alt="Logo do site" className={styles.imgLogin} />
      </Link>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1 className={styles.titulo}>Cadastro</h1>
        <Input
          type="text"
          placeholder="Informe seu nome"
          name="nome"
          error={errors.nome?.message}
          register={register}
        />
        <Input
          type="email"
          placeholder="Informe seu email"
          name="email"
          error={errors.email?.message}
          register={register}
        />
        <Input
          type="password"
          placeholder="Informe sua senha"
          name="senha"
          error={errors.senha?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="Telefone para contato"
          name="telefone"
          error={errors.telefone?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="Endereço - Rua - Avenida - Logradouro"
          name="endereco"
          error={errors.endereco?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="Nº da casa (bloco e apto, se for apartamento)"
          name="numero_casa"
          error={errors.numero_casa?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="Estado - Minas Gerais ou MG"
          name="estado"
          error={errors.estado?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="Bairro - Cidade"
          name="cidade"
          error={errors.cidade?.message}
          register={register}
        />
        <Input
          type="text"
          placeholder="CEP"
          name="cep"
          error={errors.cep?.message}
          register={register}
        />
        <button type="submit" className={styles.btnRegister}>
          Cadastrar
        </button>
        <p className={styles.login}>
          Já possui uma conta?{" "}
          <Link to="/login" className={styles.linkLogin}>
            Faça login.
          </Link>
        </p>
      </form>
    </Container>
  );
}
