import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construtor de Prompts Complexos",
  description: "Assistente interativo para construção de prompts robustos e complexos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
