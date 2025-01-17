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

// Tipagem para o formulário seguir o schema de validação
type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Função que será chamada no submit do formulário
  // Ao submeter o formulário
  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        toast.error("Email ou senha inválidos. Tente novamente.");
        return;
      }

      const user = authData?.user;
      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        toast.success("Login realizado com sucesso!");
        navigate("/"); // Redireciona para a página inicial
      } else {
        toast.error("Erro inesperado ao autenticar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao tentar realizar login.");
    }
  };

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
      } catch (err) {
        console.error("Erro ao ler o sessionStorage:", err);
        sessionStorage.removeItem("user"); // Limpa dados inválidos
      }
    }
  }, [navigate]);

  return (
    <Container>
      <Link to="/">
        <img src={logoImg} alt="Logo do site" className={styles.imgLogin} />
      </Link>

      {/* Formulário de Login */}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.titulo}>Login</h1>
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
          name="password"
          error={errors.password?.message}
          register={register}
        />
        <button type="submit" className={styles.btnRegister}>
          Entrar
        </button>
        <p className={styles.login}>
          Ainda não possui uma conta?{" "}
          <Link to={"/register"} className={styles.linkLogin}>
            <strong>Cadastre-se.</strong>
          </Link>
        </p>
      </form>
    </Container>
  );
}
