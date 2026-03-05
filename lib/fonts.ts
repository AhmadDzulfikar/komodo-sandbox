import { Cormorant_Garamond, Manrope } from "next/font/google";

export const luxurySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lux-serif",
});

export const luxurySans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-lux-sans",
});
