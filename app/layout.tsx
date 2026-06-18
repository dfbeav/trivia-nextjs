import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Who Wants To Win Bragging Rights?",
  description: "A fun trivia game to test your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${arimo.variable} h-screen antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}