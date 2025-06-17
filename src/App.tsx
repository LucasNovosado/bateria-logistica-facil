// Arquivo: src/App.tsx (atualizado)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vendedora from "./pages/Vendedora";
import Entregador from "./pages/Entregador";
import Admin from "./pages/Admin";
import AdminCanais from "./pages/AdminCanais"; // Nova página
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendedora" element={<Vendedora />} />
          <Route path="/entregador" element={<Entregador />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/canais" element={<AdminCanais />} /> {/* Nova rota */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;