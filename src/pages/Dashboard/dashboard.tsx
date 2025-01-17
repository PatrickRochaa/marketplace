import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import styles from "./Dashboard.module.css";
import toast from "react-hot-toast";
import { Container } from "../../components/Container/container";
import { FallbackImage } from "../../components/FallbackImage/FallbackImage";

import { supabase } from "../../services/supabaseClient";
import { AuthContext } from "../../context/AuthContext"; // Importando o contexto de autenticação

export function Dashboard() {
  const { loadingProducts, products, user, handleLogout } =
    useContext(AuthContext); // Pegando produtos e loading do contexto

  // Verificando se os produtos estão sendo carregados
  if (loadingProducts) {
    return <p>Carregando produtos...</p>;
  }

  // Função para deletar o produto
  async function handleDeleteProduct(productId: number) {
    try {
      const { data: productData, error } = await supabase
        .from("products")
        .select("folder_id")
        .eq("id", productId)
        .single();

      if (error || !productData) {
        console.error(
          "Erro ao buscar o folder_id:",
          error?.message || "Produto não encontrado"
        );
        toast.error("Erro ao buscar o produto");
        return;
      }

      const folderId = productData.folder_id;
      const userFolderPath = `imagesProducts/${user?.id}/`;

      // Listando os arquivos dentro da pasta do produto
      const { data: files, error: listFilesError } = await supabase.storage
        .from("imagesProducts")
        .list(userFolderPath + folderId, { limit: 100 });

      if (listFilesError) {
        console.error("Erro ao listar arquivos:", listFilesError.message);
        toast.error("Erro ao listar arquivos do produto");
        return;
      }

      if (files?.length) {
        const filePaths = files.map(
          (file) => userFolderPath + folderId + "/" + file.name
        );
        const { error: deleteError } = await supabase.storage
          .from("imagesProducts")
          .remove(filePaths);

        if (deleteError) {
          console.error("Erro ao excluir arquivos:", deleteError.message);
          toast.error("Erro ao excluir arquivos");
          return;
        }

        toast.success("Arquivos deletados com sucesso!");
      } else {
        toast("Não há arquivos para deletar.");
      }

      // Deletando o produto da tabela 'products'
      const { error: deleteProductError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteProductError) {
        console.error("Erro ao excluir o produto:", deleteProductError.message);
        toast.error("Erro ao excluir o produto");
        return;
      }

      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro inesperado:", error);
      console.log(user?.id);
      toast.error("Erro inesperado ao verificar e excluir os arquivos.");
    }
  }

  return (
    <Container>
      <div className={styles.dashboard}>
        <nav className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Meu Dashboard</h2>
          </div>
          <ul>
            <li>
              <Link to="/">Página Inicial</Link>
            </li>
            <li>
              <Link to="/dashboard/new">Novo Produto</Link>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
            </li>
            <li>
              <Link to="/cart">Carrinho</Link>
            </li>
            <li>
              <Link to="/vendas">Vendas</Link>
            </li>
            <li>
              <Link to="/compras">Compras</Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  handleLogout(); // Realiza o logout
                }}
              >
                Sair
              </Link>
            </li>
          </ul>
        </nav>

        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1>Meus Produtos</h1>
            <Link to="/dashboard/new" className={styles.addProductBtn}>
              <FiPlusCircle size={24} /> Adicionar Produto
            </Link>
          </header>

          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <FallbackImage
                    src={String(product.images[0])}
                    alt={product.name}
                    className={styles.productImage}
                    errorMessage="Imagem indisponível."
                  />
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(product.price))}
                    </p>
                    <div className={styles.productActions}>
                      <Link
                        to={`/edit-product/${product.id}`}
                        className={styles.editProduct}
                      >
                        <FiEdit size={18} /> Editar
                      </Link>
                      <button
                        className={styles.deletProduct}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FiTrash2 size={18} /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum produto cadastrado.</p>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
}
