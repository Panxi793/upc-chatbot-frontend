import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/contexts/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UPC Chatbot",
  description: "UPC Student Handbook Chatbot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/upc_image.webp" type="image/webp" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
