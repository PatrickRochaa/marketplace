import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import { AuthProvider } from "./context/AuthContext"; // context usuario
import { CartProvider } from "./context/CartContext"; // context carrinho
import "./index.css";
import { register } from "swiper/element/bundle";
register();
// Import Swiper styles
import "swiper/css"; // Para versões mais recentes
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
//Toaster
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(_jsxs(StrictMode, { children: [_jsx(Toaster, { position: "top-center", reverseOrder: false }), _jsx(AuthProvider, { children: _jsx(CartProvider, { children: _jsx(RouterProvider, { router: router }) }) })] }));
