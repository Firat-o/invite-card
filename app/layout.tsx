import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" }); 

export const metadata: Metadata = {
  title: "Hochzeitseinladung",
  description: "Wir laden dich herzlich ein",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-[#F5F5F0] text-[#1a1a1a]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
