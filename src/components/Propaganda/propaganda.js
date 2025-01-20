import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
// Importa os estilos do arquivo CSS
import styles from "./propaganda.module.css";
// Componente de container
import { Container } from "../Container/container";
// Imagem da Floresta Negra
import bannerFloresta from "../../assets/bannerFloresta.png";
// Imagem da WebCarros
import bannerWebCarros from "../../assets/bannerWebCarros.png";
export function Propaganda() {
    // Estado para controlar o índice do slide atual
    const [currentIndex, setCurrentIndex] = useState(0);
    // Estado para controlar o carregamento da imagem (loading)
    const [loading, setLoading] = useState(true);
    /* ============================================ */
    // Lista de banners com as imagens e os links
    const banners = [
        {
            img: bannerFloresta,
            link: "https://floresta-negra.vercel.app/",
        },
        {
            img: bannerWebCarros,
            link: "https://webcarros-lovat-two.vercel.app/",
        },
    ];
    /* ============================================ */
    // Hook para autoavançar os slides a cada 6 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 6000); // Troca a cada 6 segundos
        // Limpa o intervalo quando o componente é desmontado ou o hook é reexecutado
        return () => clearInterval(interval);
    }, [banners.length]);
    /* ============================================ */
    // Função chamada quando a imagem é carregada
    const handleImageLoad = () => {
        // Define o estado 'loading' como false quando a imagem é carregada
        setLoading(false);
    };
    /* ============================================ */
    return (_jsx(Container, { children: _jsx("section", { className: styles.cross_promotion, children: _jsxs("div", { className: styles.carousel, children: [loading && (_jsx("div", { className: styles.skeletonWrapper, children: _jsx("div", { className: styles.skeleton }) })), _jsx("div", { className: styles.slidesContainer, style: {
                            // Controla a posição do slide visível, baseado no índice atual
                            transform: `translateX(-${currentIndex * 100}%)`,
                            // Aplica uma transição suave entre os slides
                            transition: "transform 0.5s ease-in-out",
                        }, children: banners.map((banner, index) => (_jsx("div", { className: styles.slide, children: _jsx("a", { href: banner.link, target: "_blank", rel: "noopener noreferrer", className: styles.imageLink, children: _jsx("img", { src: banner.img, alt: banner.img, className: styles.image, 
                                    // Chama handleImageLoad quando a imagem for carregada
                                    onLoad: handleImageLoad }) }) }, index))) }), !loading && (_jsx("div", { className: styles.pagination, children: banners.map((_, index) => (_jsx("span", { className: `${styles.paginationDot} ${index === currentIndex ? styles.activeDot : ""}`, 
                            // Altera o slide ao clicar no indicador
                            onClick: () => setCurrentIndex(index) }, index))) }))] }) }) }));
}
