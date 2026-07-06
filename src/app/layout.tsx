import type { Metadata } from "next";
import { Inter, Playfair_Display, Open_Sans, Braah_One, Manrope } from "next/font/google";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";
import "@/styles/elegant.css";
import "@/styles/sunshine-young.css";
import "@/styles/style-radio.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const braahOne = Braah_One({
  variable: "--font-braah",
  subsets: ["latin"],
  weight: "400",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumière Hair Atelier",
  description: "Premium hair salon with online booking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${playfair.variable} ${openSans.variable} ${braahOne.variable} ${manrope.variable} h-full`}
      data-theme="elegant"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
