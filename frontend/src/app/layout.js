import { Inter } from "next/font/google";

import { Estrutura } from "@/components/layout/Estrutura";
import { AtualizacaoProvider } from "@/contexts/AtualizacaoContext";
import { AvisosProvider } from "@/contexts/AvisosContext";
import { ResumoDaLigaProvider } from "@/contexts/ResumoDaLigaContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Passe: mercado de jogadores",
  description: "Gestão da liga, do mercado à classificação.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <AtualizacaoProvider>
          <AvisosProvider>
            <ResumoDaLigaProvider>
              <Estrutura>{children}</Estrutura>
            </ResumoDaLigaProvider>
          </AvisosProvider>
        </AtualizacaoProvider>
      </body>
    </html>
  );
}
