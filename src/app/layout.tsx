import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Gamal — International Business Development",
    template: "%s — Ahmed Gamal",
  },
  description: "Commercial growth, B2B business development, consultative selling and GCC market development — Ahmed Gamal El-Din Gomaa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
