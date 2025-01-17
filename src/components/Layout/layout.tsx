import { GlobalHeader } from "../Header/header"; // Renomeado para usar a letra maiúscula
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <GlobalHeader /> {/* Usando com G maiúsculo */}
      <Outlet />
    </>
  );
}
