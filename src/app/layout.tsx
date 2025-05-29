import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Header from '@/widgets/header/Header';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Приложение для управления задачами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>       
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
