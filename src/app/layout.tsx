import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provide from "@/store/Provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MalabarResoi",
  description: "Taste the best of Kerala's culinary delights with dishes like Mandhi, Biriyani, Ghee Rice, Curries, Thali, Shawarma and so on at Malabar Resoi.",
  keywords: ["malabar resoi", "burger restaurant", "next.js"],
  icons: {
    icon: "/img/fav.png", 
  },
  openGraph: {
    title: "MalabarResoi",
    description: "A premium burger restaurant",
    url: "https://www.malabarresoi.com",  // Your website URL
    images: [
      {
        url: "/images/og-image.jpg",  
        width: 1200,
        height: 630,
        alt: "MalabarResoi - A premium burger restaurant",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="MalabarResoi" />
        <meta property="og:description" content="A premium burger restaurant" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://www.malabarresoi.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provide>
        {children}
        </Provide>
        <Toaster />
      </body>
    </html>
  );
}
