import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import styles from "./FallbackImage.module.css";
export function FallbackImage({
  src,
  alt,
  errorMessage = "Erro ao carregar a imagem.",
  className,
}: {
  src?: string | string[]; // Aceita string ou array de strings
  alt?: string;
  errorMessage?: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  // Transformar array em string (pegar a primeira URL válida)
  const imageUrl = Array.isArray(src) ? src[0] : src;

  return (
    <div className={styles.imageContainer}>
      {!hasError ? (
        <img
          src={imageUrl}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={styles.errorContainer}>
          <MdErrorOutline className={styles.errorIcon} />
          <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
