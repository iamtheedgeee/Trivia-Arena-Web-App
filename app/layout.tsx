import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "./Provider"
import Header from "@/components/Header";
import SocketProvider from "@/hooks/SocketContext";
/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/
export const metadata: Metadata = {
  title: "Trivia Arena",
  description: "Trivia Arena Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" h-screen">
          {/*<Header/>*/}
          <SocketProvider>
              {children}
          </SocketProvider>
      </body>
    </html>
  );
}
