import type { ReactNode } from "react";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata = {
  title: "Taskflow Studio",
  description: "Gerenciador de tarefas do projeto final de DevOps"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={spaceGrotesk.variable}>{children}</body>
    </html>
  );
}
