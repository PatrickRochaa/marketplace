var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const { loadingProducts, products, user, handleLogout } = useContext(AuthContext); // Pegando produtos e loading do contexto
    // Verificando se os produtos estão sendo carregados
    if (loadingProducts) {
        return _jsx("p", { children: "Carregando produtos..." });
    }
    // Função para deletar o produto
    function handleDeleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: productData, error } = yield supabase
                    .from("products")
                    .select("folder_id")
                    .eq("id", productId)
                    .single();
                if (error || !productData) {
                    console.error("Erro ao buscar o folder_id:", (error === null || error === void 0 ? void 0 : error.message) || "Produto não encontrado");
                    toast.error("Erro ao buscar o produto");
                    return;
                }
                const folderId = productData.folder_id;
                const userFolderPath = `imagesProducts/${user === null || user === void 0 ? void 0 : user.id}/`;
                // Listando os arquivos dentro da pasta do produto
                const { data: files, error: listFilesError } = yield supabase.storage
                    .from("imagesProducts")
                    .list(userFolderPath + folderId, { limit: 100 });
                if (listFilesError) {
                    console.error("Erro ao listar arquivos:", listFilesError.message);
                    toast.error("Erro ao listar arquivos do produto");
                    return;
                }
                if (files === null || files === void 0 ? void 0 : files.length) {
                    const filePaths = files.map((file) => userFolderPath + folderId + "/" + file.name);
                    const { error: deleteError } = yield supabase.storage
                        .from("imagesProducts")
                        .remove(filePaths);
                    if (deleteError) {
                        console.error("Erro ao excluir arquivos:", deleteError.message);
                        toast.error("Erro ao excluir arquivos");
                        return;
                    }
                    toast.success("Arquivos deletados com sucesso!");
                }
                else {
                    toast("Não há arquivos para deletar.");
                }
                // Deletando o produto da tabela 'products'
                const { error: deleteProductError } = yield supabase
                    .from("products")
                    .delete()
                    .eq("id", productId);
                if (deleteProductError) {
                    console.error("Erro ao excluir o produto:", deleteProductError.message);
                    toast.error("Erro ao excluir o produto");
                    return;
                }
                toast.success("Produto excluído com sucesso!");
            }
            catch (error) {
                console.error("Erro inesperado:", error);
                console.log(user === null || user === void 0 ? void 0 : user.id);
                toast.error("Erro inesperado ao verificar e excluir os arquivos.");
            }
        });
    }
    return (_jsx(Container, { children: _jsxs("div", { className: styles.dashboard, children: [_jsxs("nav", { className: styles.sidebar, children: [_jsx("div", { className: styles.sidebarHeader, children: _jsx("h2", { children: "Meu Dashboard" }) }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/", children: "P\u00E1gina Inicial" }) }), _jsx("li", { children: _jsx(Link, { to: "/dashboard/new", children: "Novo Produto" }) }), _jsx("li", { children: _jsx(Link, { to: "/profile", children: "Perfil" }) }), _jsx("li", { children: _jsx(Link, { to: "/cart", children: "Carrinho" }) }), _jsx("li", { children: _jsx(Link, { to: "/vendas", children: "Vendas" }) }), _jsx("li", { children: _jsx(Link, { to: "/compras", children: "Compras" }) }), _jsx("li", { children: _jsx(Link, { to: "/", onClick: () => {
                                            handleLogout(); // Realiza o logout
                                        }, children: "Sair" }) })] })] }), _jsxs("main", { className: styles.mainContent, children: [_jsxs("header", { className: styles.header, children: [_jsx("h1", { children: "Meus Produtos" }), _jsxs(Link, { to: "/dashboard/new", className: styles.addProductBtn, children: [_jsx(FiPlusCircle, { size: 24 }), " Adicionar Produto"] })] }), _jsx("div", { className: styles.productGrid, children: products.length > 0 ? (products.map((product) => {
                                var _a;
                                return (_jsxs("div", { className: styles.productCard, children: [_jsx(FallbackImage, { src: ((_a = product.images[0]) === null || _a === void 0 ? void 0 : _a.src[0]) || "", alt: product.name, className: styles.productImage, errorMessage: "Imagem indispon\u00EDvel." }), _jsxs("div", { className: styles.productInfo, children: [_jsx("h3", { children: product.name }), _jsx("p", { children: new Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(Number(product.price)) }), _jsxs("div", { className: styles.productActions, children: [_jsxs(Link, { to: `/edit-product/${product.id}`, className: styles.editProduct, children: [_jsx(FiEdit, { size: 18 }), " Editar"] }), _jsxs("button", { className: styles.deletProduct, onClick: () => handleDeleteProduct(product.id), children: [_jsx(FiTrash2, { size: 18 }), " Excluir"] })] })] })] }, product.id));
                            })) : (_jsx("p", { children: "Nenhum produto cadastrado." })) })] })] }) }));
}
