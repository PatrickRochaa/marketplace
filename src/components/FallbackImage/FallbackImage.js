import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import styles from "./FallbackImage.module.css";
export function FallbackImage({ src, alt, errorMessage = "Erro ao carregar a imagem.", className, }) {
    const [hasError, setHasError] = useState(false);
    // Transformar array em string (pegar a primeira URL válida)
    const imageUrl = Array.isArray(src) ? src[0] : src;
    return (_jsx("div", { className: styles.imageContainer, children: !hasError ? (_jsx("img", { src: imageUrl, alt: alt, className: className, onError: () => setHasError(true) })) : (_jsxs("div", { className: styles.errorContainer, children: [_jsx(MdErrorOutline, { className: styles.errorIcon }), _jsx("p", { className: styles.errorMessage, children: errorMessage })] })) }));
}
