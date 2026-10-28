import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import "./globals.css";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono, Special_Elite, Instrument_Sans, Newsreader, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";

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

const ui = Instrument_Sans({ adjustFontFallback: false, subsets: ["latin"], variable: "--font-ui", display: "swap" });
const editorial = Newsreader({ adjustFontFallback: false, subsets: ["latin"], style: ["normal", "italic"], variable: "--font-editorial", display: "swap" });
const bengaliSans = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bn-sans", display: "swap" });
const bengaliSerif = Noto_Serif_Bengali({ subsets: ["bengali"], variable: "--font-bn-serif", display: "swap" });

const themeScript = `(function(){var t;try{t=localStorage.getItem('tape-theme-v1')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'})()`;

export const metadata: Metadata = {
  title: "tape_x247",
  description:
    "A zine and living archive for underground electronic music across South Asia.",
  icons: {
    icon: "/logos-fonts/main logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} ${stamp.variable} ${ui.variable} ${editorial.variable} ${bengaliSans.variable} ${bengaliSerif.variable}`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Background />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-oxide focus:p-4">Skip to content</a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />

      </body>
    </html>
  );
}
