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

          {/* Indicadores de navegação para cada slide, aparecem quando o 'loading' é falso */}
          {!loading && (
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
          )}
        </div>
      </section>
    </Container>
  );
}
