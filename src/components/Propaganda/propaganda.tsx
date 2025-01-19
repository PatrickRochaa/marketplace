import { useState, useEffect } from "react";
// Importa os estilos do arquivo CSS
import styles from "./propaganda.module.css";
// Componente de container
import { Container } from "../Container/container";
// Imagem da Floresta Negra
import bannerFloresta from "../../assets/bannerFloresta.png";
// Imagem da WebCarros
import bannerWebCarros from "../../assets/bannerWebCarros.png";
// Importando as setas do React Icons
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";

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
  // Função para avançar para o próximo slide
  const nextSlide = () => {
    // Atualiza o índice do slide para o próximo, se chegar no final, volta para o primeiro
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  /* ============================================ */
  // Função para retroceder para o slide anterior
  const prevSlide = () => {
    // Atualiza o índice do slide para o anterior, se estiver no primeiro, vai para o último
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  /* ============================================ */
  // Hook para autoavançar os slides a cada 8 segundos
  useEffect(() => {
    // Cria um intervalo que chama a função nextSlide a cada 8 segundos
    const interval = setInterval(nextSlide, 8000);

    // Limpa o intervalo quando o componente é desmontado ou o hook é reexecutado
    return () => clearInterval(interval);
  }, []);

  /* ============================================ */
  // Função chamada quando a imagem é carregada
  const handleImageLoad = () => {
    // Define o estado 'loading' como false quando a imagem é carregada
    setLoading(false);
  };

  /* ============================================ */
  return (
    <Container>
      <section className={styles.cross_promotion}>
        <div className={styles.carousel}>
          {/* Skeleton (esqueleto de carregamento) que aparece enquanto as imagens não carregam */}
          {loading && (
            <div className={styles.skeletonWrapper}>
              <div className={styles.skeleton}></div>
            </div>
          )}

          {/* Contêiner que controla os slides */}
          <div
            className={styles.slidesContainer}
            style={{
              // Controla a posição do slide visível, baseado no índice atual
              transform: `translateX(-${currentIndex * 100}%)`,
              // Aplica uma transição suave entre os slides
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {/* Mapeia os banners e exibe um slide para cada um */}
            {banners.map((banner, index) => (
              <div key={index} className={styles.slide}>
                {/* Link do banner que direciona para o URL correspondente */}
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageLink}
                >
                  {/* Imagem do banner */}
                  <img
                    src={banner.img}
                    alt={banner.img}
                    className={styles.image}
                    // Chama handleImageLoad quando a imagem for carregada
                    onLoad={handleImageLoad}
                  />
                </a>
              </div>
            ))}
          </div>

          {/* Botões de navegação, aparecem apenas quando o 'loading' é falso */}
          {!loading && (
            <>
              <button className={styles.prevButton} onClick={prevSlide}>
                <RiArrowLeftDoubleFill /> {/* Seta para retroceder */}
              </button>
              <button className={styles.nextButton} onClick={nextSlide}>
                <RiArrowRightDoubleFill /> {/* Seta para avançar */}
              </button>
            </>
          )}

          {/* Indicadores de navegação para cada slide, aparecem quando o 'loading' é falso */}
          {!loading && (
            <>
              <div className={styles.pagination}>
                {/* Cria um ponto de navegação para cada banner */}
                {banners.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.paginationDot} ${
                      index === currentIndex ? styles.activeDot : ""
                    }`}
                    // Altera o slide ao clicar no indicador
                    onClick={() => setCurrentIndex(index)}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Container>
  );
}
