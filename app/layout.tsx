import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hochzeitseinladung",
  description: "Wir laden dich herzlich ein",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      {/* HIER: suppressHydrationWarning hinzufügen, damit die Console sauber bleibt */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}