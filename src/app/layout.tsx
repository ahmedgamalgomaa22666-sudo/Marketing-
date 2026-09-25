import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Gamal — Commercial & Business Development",
    template: "%s — Ahmed Gamal",
  },
  description: "Ahmed Gamal El-Din Gomaa — B2B prospect research, account intelligence and outreach support for companies targeting the UAE, Saudi Arabia and the wider GCC. 15+ years of commercial sales; B2B business development since 2026.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
