import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/home";
import { Dashboard } from "./pages/Dashboard/dashboard";
import { NewProduct } from "./pages/Dashboard/newProduct/newProduct";
import { Login } from "./pages/Login/login";
import { Register } from "./pages/Register/register";
import { EditProduct } from "./pages/Edit/edit";
import { Profile } from "./pages/Profile/profile";
import { CartPage } from "./pages/Cart/cart";
import { Pagamento } from "./pages/Pagamento/pagamento";
import { Vendas } from "./pages/Vendas/vendas";
import { Compras } from "./pages/Compras/compras";
import { NotFound } from "./pages/NotFound/NotFound";
import { Layout } from "./components/Layout/layout";
import ProtectedRoute from "./routes/Private";
const router = createBrowserRouter([
    {
        element: _jsx(Layout, {}),
        children: [
            {
                path: "/",
                element: _jsx(Home, {}),
            },
            {
                path: "/dashboard",
                element: (_jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) })),
            },
            {
                path: "/dashboard/new",
                element: (_jsx(ProtectedRoute, { children: _jsx(NewProduct, {}) })),
            },
            {
                path: "/profile",
                element: (_jsx(ProtectedRoute, { children: _jsx(Profile, {}) })),
            },
            {
                path: "/edit-product/:id",
                element: (_jsx(ProtectedRoute, { children: _jsx(EditProduct, {}) })),
            },
            {
                path: "/cart",
                element: (_jsx(ProtectedRoute, { children: _jsx(CartPage, {}) })),
            },
            {
                path: "/pagamento",
                element: (_jsx(ProtectedRoute, { children: _jsx(Pagamento, {}) })),
            },
            {
                path: "/vendas",
                element: (_jsx(ProtectedRoute, { children: _jsx(Vendas, {}) })),
            },
            {
                path: "/compras",
                element: (_jsx(ProtectedRoute, { children: _jsx(Compras, {}) })),
            },
        ],
    },
    {
        path: "/login",
        element: _jsx(Login, {}),
    },
    {
        path: "/register",
        element: _jsx(Register, {}),
    },
    {
        path: "*",
        element: _jsx(NotFound, {}),
    },
]);
export { router };
