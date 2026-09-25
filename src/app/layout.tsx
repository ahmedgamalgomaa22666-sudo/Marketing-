import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Gamal — Commercial & Business Development",
    template: "%s — Ahmed Gamal",
  },
  description: "Ahmed Gamal El-Din Gomaa — commercial growth and business development professional with 15+ years of sales, market development and leadership experience; B2B business development across the UAE, Saudi Arabia and GCC markets since 2026.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
