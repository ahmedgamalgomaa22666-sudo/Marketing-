import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Gamal — Commercial & Business Development",
    template: "%s — Ahmed Gamal",
  },
  description: "Ahmed Gamal El-Din Gomaa — 15+ years of pharmaceutical commercial sales leadership, now in B2B business development for the GCC. Verified results, case studies and proof of work.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
