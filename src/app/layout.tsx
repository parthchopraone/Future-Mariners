import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteUrl } from "@/utils/envExport";
import { Inter, Inter_Tight, Mulish } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Future Mariners Foundation",
    template: `%s | ${siteName}`,
  },
  description: "Future Mariners Foundation IMUCET preparation courses.",
  keywords: ["Future Mariners", "IMUCET", "IMUCET preparation"],

  openGraph: {
    title: `${siteName} | IMUCET Preparation`,
    description: "Prepare with purpose. Sail with confidence.",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Future Mariners Foundation",
      },
    ],
  },

  twitter: {
    title: `${siteName} | IMUCET Preparation`,
    description: "Prepare with purpose. Sail with confidence.",
    card: "summary_large_image",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Future Mariners Foundation",
      },
    ],
  },
  icons: { icon: "/images/logo.jpg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${mulish.variable} ${inter.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
