import type { Metadata } from "next";
import "./globals.css";
import { luxurySans, luxurySerif } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "12 Seas Alliance",
  description: "Luxury yacht and cabin booking platform by 12 Seas Alliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${luxurySans.variable} ${luxurySerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
