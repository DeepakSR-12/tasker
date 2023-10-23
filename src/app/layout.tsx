import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Modal from "../components/Modal";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasker",
  description: "Next Generation Task Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-100`}>
          <Modal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
