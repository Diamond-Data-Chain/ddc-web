import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { WalletProvider } from "./WalletProvider";

export const metadata: Metadata = {
 title: "Diamond Data Chain — DDC",
 description: "AI-Driven Layer-1 for the Intelligent Data Economy",

 metadataBase: new URL("https://diamonddatachain.org"),

 alternates: {
  canonical: "/",
 },

 openGraph: {
  url: "https://diamonddatachain.org",
  siteName: "Diamond Data Chain",
 },
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en">
 <body>
 <WalletProvider>
 {children}
 </WalletProvider>
 </body>
 </html>
 );
}
