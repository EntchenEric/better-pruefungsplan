import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Better Prüfungsplan",
  description: "Besser lesbarer Prüfungsplan für Informatik an der W-HS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang="de" suppressHydrationWarning nonce={nonce}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}