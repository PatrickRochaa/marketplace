import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import styles from "./propaganda.module.css"; // Importa os estilos do arquivo CSS
import { Container } from "../Container/container"; // Componente de container
import bannerFloresta from "../../assets/bannerFloresta.png"; // Imagem da Floresta Negra
import bannerWebCarros from "../../assets/bannerWebCarros.png"; // Imagem da WebCarros
export function Propaganda() {
    // Definindo o estado para o índice atual da imagem exibida
    const [currentIndex, setCurrentIndex] = useState(0);
    // Estado que controla o carregamento das imagens
    const [loading, setLoading] = useState(true);
    // Lista de banners com as imagens e links
    const banners = [
        {
            img: bannerFloresta,
            link: "https://floresta-negra.vercel.app/", // Link para o banner da Floresta Negra
        },
        {
            img: bannerWebCarros,
            link: "https://webcarros-lovat-two.vercel.app/", // Link para o banner do WebCarros
        },
    ];
    // Função que avança para o próximo banner, aplicando a rotação dos slides
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length); // Incrementa o índice e volta ao início se atingir o final
    };
    // Autoplay - faz o slideshow avançar automaticamente a cada 5 segundos
    useEffect(() => {
        const interval = setInterval(nextSlide, 8000); // Configura o intervalo de 8 segundos
        return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    }, []);
    // Função que altera o estado de 'loading' para 'false' quando a imagem é carregada
    const handleImageLoad = () => {
        setLoading(false); // Define 'loading' como falso após carregar a imagem
    };
    return (_jsx(Container, { children: _jsx("section", { className: styles.cross_promotion, children: _jsxs("div", { className: styles.carousel, children: [_jsx("div", { className: styles.slidesContainer, style: {
                            transform: `translateX(-${currentIndex * 100}%)`, // Controla a posição do slide atual
                            transition: "transform 0.5s ease-in-out", // Transição suave entre os slides
                        }, children: banners.map((banner, index) => (_jsx("div", { className: styles.slide, children: _jsx("a", { href: banner.link, target: "_blank" // Abre o link em uma nova aba
                                , rel: "noopener noreferrer" // Protege contra vulnerabilidades de segurança
                                , className: styles.imageLink, children: loading && index === currentIndex ? (_jsx("div", { className: styles.skeleton }) // Skeleton visível somente para o slide atual
                                ) : (_jsx("img", { src: banner.img, alt: banner.img, className: styles.image, onLoad: handleImageLoad })) }) }, index))) }), _jsx("div", { className: styles.pagination, children: banners.map((_, index) => (_jsx("span", { className: `${styles.paginationDot} ${index === currentIndex ? styles.activeDot : "" // Adiciona a classe do ponto ativo
                            }`, onClick: () => setCurrentIndex(index) }, index))) })] }) }) }));
}
