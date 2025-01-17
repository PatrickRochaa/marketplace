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
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <ProtectedRoute>
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-product/:id",
        element: (
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pagamento",
        element: (
          <ProtectedRoute>
            <Pagamento />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vendas",
        element: (
          <ProtectedRoute>
            <Vendas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/compras",
        element: (
          <ProtectedRoute>
            <Compras />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
