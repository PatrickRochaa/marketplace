import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { GlobalHeader } from "../Header/header"; // Renomeado para usar a letra maiúscula
import { Outlet } from "react-router-dom";
export function Layout() {
    return (_jsxs(_Fragment, { children: [_jsx(GlobalHeader, {}), " ", _jsx(Outlet, {})] }));
}
