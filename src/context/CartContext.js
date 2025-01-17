var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, } from "react";
import { useAuth } from "./AuthContext"; // Importa o contexto de autenticação
import toast from "react-hot-toast"; // alertas
import { supabase } from "../services/supabaseClient"; // Importando o cliente do Supabase
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const { user } = useAuth(); // Acessa o usuário logado através do contexto de autenticação
    //estado para exporta os produtos adicionados
    const [cartItems, setCartItems] = useState([]);
    const [tempCart, setTempCart] = useState([]);
    // Função para sincronizar os itens do carrinho (do sessionStorage com o Supabase)
    const syncCart = () => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return; // Se o usuário não estiver logado, não faz nada.
        const storedCart = JSON.parse(sessionStorage.getItem("tempCart") || "[]");
        if (storedCart.length > 0) {
            try {
                // Passo 1: Verifica se o id_comprador já existe na tabela carrinho
                const { data: supabaseCart, error: supabaseError } = yield supabase
                    .from("carrinho")
                    .select("produto_id, quantidade")
                    .eq("id_comprador", user.id); // Verifica carrinho para o usuário logado
                if (supabaseError)
                    throw new Error(supabaseError.message);
                // Passo 2: Se o user_id não existir, adiciona os produtos diretamente (usuário novo)
                if (supabaseCart.length === 0) {
                    for (const item of storedCart) {
                        const { error: insertError } = yield supabase
                            .from("carrinho")
                            .insert([
                            {
                                id_comprador: user.id,
                                nome_comprador: user.name,
                                produto_id: item.id,
                                nome_produto: item.name,
                                id_vendedor: item.user_id,
                                quantidade: item.quantity,
                                preco_unitario: item.price,
                                preco_total: item.price * item.quantity,
                            },
                        ]);
                        if (insertError)
                            throw new Error(insertError.message);
                    }
                    toast.success("Produtos adicionados ao carrinho com sucesso!");
                }
                else {
                    // Passo 3: Se o user_id já existir, verifica os produtos no carrinho
                    for (const item of storedCart) {
                        const existingProduct = supabaseCart.find((prod) => prod.produto_id === item.id);
                        if (existingProduct) {
                            // Passo 4: Se o produto já está no carrinho, soma as quantidades
                            const updatedQuantity = existingProduct.quantidade + item.quantity;
                            // Atualiza a quantidade no Supabase
                            const { error: updateError } = yield supabase
                                .from("carrinho")
                                .update({ quantidade: updatedQuantity })
                                .eq("id_comprador", user.id)
                                .eq("produto_id", item.id);
                            if (updateError)
                                throw new Error(updateError.message);
                        }
                        else {
                            // Passo 5: Se o produto não está no carrinho, adiciona o produto
                            const { error: insertError } = yield supabase
                                .from("carrinho")
                                .insert([
                                {
                                    id_comprador: user.id,
                                    nome_comprador: user.name,
                                    produto_id: item.id,
                                    quantidade: item.quantity,
                                    preco_unitario: item.price,
                                    preco_total: item.price * item.quantity,
                                },
                            ]);
                            if (insertError)
                                throw new Error(insertError.message);
                        }
                    }
                    toast.success("Carrinho atualizado com sucesso!");
                }
                // Após a sincronização, limpa o sessionStorage
                sessionStorage.removeItem("tempCart");
            }
            catch (_a) {
                toast.error("Erro ao sincronizar carrinho.");
            }
        }
    });
    /* ======================================================= */
    // Carrega os itens do carrinho quando o componente for montado e quando o usuário mudar
    useEffect(() => {
        const fetchCartItems = () => __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return; // Se não houver usuário logado, não tenta carregar o carrinho
            try {
                // Busca os itens do carrinho no Supabase para o usuário logado
                const { data, error } = yield supabase
                    .from("carrinho")
                    .select("produto_id, quantidade")
                    .eq("id_comprador", user.id); // Corrigido para usar "user_id" ao invés de "id"
                if (error) {
                    throw new Error(error.message);
                }
                // Obtém os detalhes dos produtos para cada produto no carrinho
                const productPromises = data.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const { data: productData, error: productError } = yield supabase
                        .from("products")
                        .select("*")
                        .eq("id", item.produto_id)
                        .single();
                    if (productError) {
                        throw new Error(productError.message);
                    }
                    return Object.assign(Object.assign({}, productData), { quantity: item.quantidade });
                }));
                const products = yield Promise.all(productPromises);
                setCartItems(products); // Atualiza o estado com os produtos do carrinho
            }
            catch (_a) {
                toast.error("Erro ao carregar itens do carrinho.");
            }
        });
        fetchCartItems();
        syncCart(); // Adiciona a chamada para sincronizar os itens do carrinho
    }, [user]); // Recarrega quando o usuário mudar
    /* ================================================================ */
    //verificar se tem usuario se nao tiver, deixa o carrinho limpo
    useEffect(() => {
        if (!user) {
            // Limpa o estado do carrinho
            setCartItems([]);
            setTempCart([]);
            // Limpa o sessionStorage
            sessionStorage.removeItem("tempCart");
            //console.log("Carrinho limpo após logout!");
        }
    }, [user]);
    /* =================================================================== */
    const addToCart = (product_1, ...args_1) => __awaiter(this, [product_1, ...args_1], void 0, function* (product, quantity = 1) {
        if (!user) {
            // Se o usuário não estiver logado, manipula o tempCart
            const cart = JSON.parse(sessionStorage.getItem("tempCart") || "[]");
            const existingProductIndex = cart.findIndex((item) => item.id === product.id);
            if (existingProductIndex >= 0) {
                // Se o produto já existir no carrinho, incrementa a quantidade
                cart[existingProductIndex].quantity += quantity;
            }
            else {
                // Caso contrário, adiciona o produto com a quantidade especificada
                cart.push(Object.assign(Object.assign({}, product), { quantity }));
            }
            // Atualiza o sessionStorage e o estado do tempCart
            sessionStorage.setItem("tempCart", JSON.stringify(cart));
            setTempCart(cart); // Atualiza o estado do tempCart
            //console.log("TempCart após atualização:", cart); // Log para depuração
            // Exibe o toast aqui, mesmo quando o usuário estiver deslogado
            toast.success("Produto adicionado ao carrinho!");
            return;
        }
        // Verifica se o produto que o usuário está tentando adicionar pertence a ele
        const { data: productData, error: productError } = yield supabase
            .from("products") // Tabela correta para verificar se o produto é do usuário
            .select("user_id")
            .eq("id", product.id)
            .single(); // Espera um único produto
        if (productError) {
            toast.error("Erro ao verificar o produto.");
            console.error(productError.message);
            return;
        }
        // Se o produto foi cadastrado pelo usuário, não deixa adicionar
        if (productData && productData.user_id === user.id) {
            toast.error("Você não pode adicionar um produto que você mesmo cadastrou ao carrinho.");
            return; // Não faz nada se o produto for do usuário
        }
        // Caso o usuário esteja logado, o processo de atualização é o seguinte:
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                // Se o produto já estiver no carrinho, incrementa a quantidade
                return prevItems.map((item) => item.id === product.id
                    ? Object.assign(Object.assign({}, item), { quantity: item.quantity + quantity }) : item);
            }
            // Se o produto não estiver no carrinho, adiciona com a quantidade desejada
            return [...prevItems, Object.assign(Object.assign({}, product), { quantity })];
        });
        try {
            // Buscar todos os registros do usuário para o produto
            const { data: existingProducts, error } = yield supabase
                .from("carrinho")
                .select("id, quantidade")
                .eq("id_comprador", user.id)
                .eq("produto_id", product.id);
            if (error) {
                throw new Error(error.message);
            }
            if (existingProducts.length > 0) {
                // Soma as quantidades
                const totalQuantity = existingProducts.reduce((sum, item) => sum + item.quantidade, 0) +
                    quantity;
                // Atualizar a primeira linha com a quantidade total
                const { error: updateError } = yield supabase
                    .from("carrinho")
                    .update({ quantidade: totalQuantity })
                    .eq("id", existingProducts[0].id);
                if (updateError) {
                    throw new Error(updateError.message);
                }
                // Excluir linhas redundantes
                const redundantIds = existingProducts.slice(1).map((item) => item.id);
                if (redundantIds.length > 0) {
                    const { error: deleteError } = yield supabase
                        .from("carrinho")
                        .delete()
                        .in("id", redundantIds);
                    if (deleteError) {
                        throw new Error(deleteError.message);
                    }
                }
                toast.success("Carrinho atualizado com sucesso!");
            }
            else {
                // Se não houver registros, insere um novo
                const { error: insertError } = yield supabase.from("carrinho").insert([
                    {
                        id_comprador: user.id,
                        nome_comprador: user.name,
                        nome_produto: product.name,
                        id_vendedor: product.user_id,
                        produto_id: product.id,
                        quantidade: quantity,
                        preco_unitario: product.price,
                        preco_total: product.price * quantity,
                    },
                ]);
                if (insertError) {
                    throw new Error(insertError.message);
                }
                toast.success("Produto adicionado ao carrinho!");
            }
        }
        catch (error) {
            toast.error("Erro ao adicionar produto ao carrinho.");
            console.error(error);
        }
    });
    /* ================================================================= */
    const removeFromCart = (productId) => __awaiter(this, void 0, void 0, function* () {
        // Atualiza o cartItems (carrinho na memória) removendo o item
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        // Atualiza o tempCart removendo o item
        const storedCart = JSON.parse(sessionStorage.getItem("tempCart") || "[]");
        const updatedCart = storedCart.filter((item) => item.id !== productId);
        // Atualiza o sessionStorage com o carrinho temporário atualizado
        sessionStorage.setItem("tempCart", JSON.stringify(updatedCart));
        // Exibe o toast mesmo que o usuário esteja deslogado
        toast.success("Produto removido do carrinho.");
        // Só tenta remover do banco de dados se o usuário estiver logado
        if (user) {
            try {
                const { error } = yield supabase
                    .from("carrinho")
                    .delete()
                    .eq("produto_id", productId)
                    .eq("id_comprador", user.id);
                if (error) {
                    throw new Error(error.message);
                }
                toast.success("Produto removido do carrinho.");
            }
            catch (_a) {
                toast.error("Erro ao remover produto do carrinho.");
            }
        }
    });
    /* =============================================================== */
    const updateQuantity = (productId, quantity) => __awaiter(this, void 0, void 0, function* () {
        // Garantir que a quantidade seja válida
        if (quantity < 1) {
            removeFromCart(productId); // Remove o produto se a quantidade for menor que 1
        }
        else {
            // Caso o usuário não esteja logado, realiza as operações com o tempCart
            if (!user) {
                const cart = JSON.parse(sessionStorage.getItem("tempCart") || "[]");
                // Atualiza a quantidade do produto no tempCart
                const updatedCart = cart.map((item) => item.id === productId ? Object.assign(Object.assign({}, item), { quantity }) : item);
                // Se a quantidade for menor que 1, removemos o item do carrinho
                const filteredCart = updatedCart.filter((item) => item.quantity > 0);
                sessionStorage.setItem("tempCart", JSON.stringify(filteredCart));
                setTempCart(filteredCart); // Atualiza o estado do tempCart
                console.log("TempCart após atualização:", filteredCart); // Log para depuração
                return;
            }
            // Caso o usuário esteja logado, o processo de atualização é o seguinte:
            try {
                // Buscar o produto específico no carrinho
                const { data: cartItem, error: fetchError } = yield supabase
                    .from("carrinho")
                    .select("*")
                    .eq("id_comprador", user.id)
                    .eq("produto_id", productId)
                    .single();
                if (fetchError) {
                    throw new Error(fetchError.message);
                }
                // Se a quantidade for menor que 1, remove o item do banco de dados
                if (quantity < 1) {
                    yield supabase.from("carrinho").delete().eq("id", cartItem.id);
                    // Atualiza o estado local do carrinho removendo o item
                    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
                    toast.success("Produto removido do carrinho!");
                    return;
                }
                // Calcular o novo preço total
                const newPrecoTotal = cartItem.preco_unitario * quantity;
                // Atualiza o carrinho no banco de dados com a nova quantidade e preço total
                const { error: updateError } = yield supabase
                    .from("carrinho")
                    .update({
                    quantidade: quantity,
                    preco_total: newPrecoTotal, // Recalcula o preço total
                })
                    .eq("id", cartItem.id);
                if (updateError) {
                    throw new Error(updateError.message);
                }
                // Atualiza o estado local do carrinho com o novo valor
                setCartItems((prevItems) => prevItems.map((item) => item.id === productId
                    ? Object.assign(Object.assign({}, item), { quantity, preco_total: newPrecoTotal }) : item));
                toast.success("Quantidade atualizada com sucesso!");
            }
            catch (error) {
                toast.error("Erro ao atualizar a quantidade.");
                console.error(error);
            }
        }
    });
    /* =============================================================== */
    //funçao para calcular total carrinho
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    /* =============================================================== */
    return (_jsx(CartContext.Provider, { value: {
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            total,
            tempCart,
        }, children: children }));
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
