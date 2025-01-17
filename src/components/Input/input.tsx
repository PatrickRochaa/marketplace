import { RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "./input.module.css";

//interface para configurar o recebimento
//das propriedades do input
interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input({
  type,
  placeholder,
  name,
  register,
  error,
  rules,
}: InputProps) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
        className={styles.input}
      />
      {error && <p className={styles.erro}>{error}</p>}
    </div>
  );
}
