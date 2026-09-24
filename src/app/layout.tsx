import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Gamal El-Din Gomaa — Pharmaceutical Sales Leadership & Business Development",
    template: "%s — Ahmed Gamal El-Din Gomaa",
  },
  description: "Pharmaceutical sales leadership, B2B business development and consultative selling across the UAE, Saudi Arabia and Egypt.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
