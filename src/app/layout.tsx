"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactFlowProvider } from "reactflow";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Metadata object cannot be exported from a client component.
const metadata: Metadata = {
  title: "FlowForge AI",
  description: "Каскадная генерация контента с помощью AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactFlowProvider>
            {children}
          </ReactFlowProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
