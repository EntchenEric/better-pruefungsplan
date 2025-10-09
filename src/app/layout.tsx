import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "../components/ThemeProvider";

/**
 * The Metadata of the Page.
 */
export const metadata: Metadata = {
  title: "Better Prüfungsplan",
  description: "Besser lesbarer Prüfungsplan für Informatik an der W-HS",
};

/**
 * The main Layout of the Page.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns The Children wrapped in the main Layout of the Page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
