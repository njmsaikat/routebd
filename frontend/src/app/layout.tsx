import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/lib/react-query/Providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "RouteBD — Intelligent Dhaka Bus Route Search",
  description: "Find the best bus route between any two points in Dhaka: fares, stops, and transfers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
