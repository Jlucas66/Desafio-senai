import { Inter } from "next/font/google";

import { Cabecalho } from "@/components/layout/Cabecalho";
import { AvisosProvider } from "@/contexts/AvisosContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Passe: mercado de jogadores",
  description: "Gestão da liga, do mercado à classificação.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <AvisosProvider>
          <Cabecalho />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
            Liga Fictícia 2026 · Horário de Brasília (UTC−3)
          </footer>
        </AvisosProvider>
      </body>
    </html>
  );
}
