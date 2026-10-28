import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono, Special_Elite } from "next/font/google";

const display = Inter({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});
const stamp = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-stamp",
});

export const metadata: Metadata = {
  title: "tape_x247",
  description: SITE.description,
  icons: {
    icon: "/logos-fonts/main logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${stamp.variable}`}
    >
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-oxide focus:p-4">Skip to content</a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />

      </body>
    </html>
  );
}
