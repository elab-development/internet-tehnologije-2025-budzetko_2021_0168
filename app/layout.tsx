import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pametne finansije",
  description: "Aplikacija za praćenje troškova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 6000,
              style: {
                background: '#0f172a', 
                color: '#f8fafc',
                border: '1px solid rgba(139, 92, 246, 0.5)', 
                padding: '16px',
                borderRadius: '20px',
                fontSize: '14px',
                boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.2)', 
              },
            }} 
      /> 
        
        {children}
      </body>
    </html>
  );
}