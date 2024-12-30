import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LegalIA Honduras",
  description: "Plataforma de asistencia legal con IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
