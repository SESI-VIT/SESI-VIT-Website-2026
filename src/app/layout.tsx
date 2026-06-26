import type { Metadata } from "next";
import { Inter, Outfit, Orbitron } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["700"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: {
    default: "SESI Student Chapter | VIT Vellore",
    template: "%s | SESI VIT"
  },
  description: "Official website of the Solar Energy Society of India (SESI) Student Chapter at VIT Vellore. Empowering students to lead the future of sustainable energy through innovation, events, and research.",
  keywords: ["SESI", "Solar Energy Society of India", "VIT Vellore", "Solar Club", "Renewable Energy Club", "VIT", "Student Chapter"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SESI Student Chapter | VIT Vellore",
    description: "Empowering students to innovate, collaborate, and lead the future of sustainable energy.",
    url: "/",
    siteName: "SESI VIT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SESI Student Chapter Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SESI Student Chapter VIT Vellore",
  "alternateName": "Solar Energy Society of India Student Chapter VIT Vellore",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in",
  "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://sesivit.org.in"}/icon.png`,
  "sameAs": [
    "https://www.instagram.com/sesi.vit/",
    "https://www.linkedin.com/company/sesi-vit/",
    "https://sesivit.wordpress.com/"
  ],
  "knowsAbout": ["Solar Energy", "Renewable Energy", "Sustainability", "Photovoltaics", "Clean Technology"],
  "location": {
    "@type": "Place",
    "name": "VIT Vellore",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vellore",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "India"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${orbitron.variable} bg-black text-white min-h-screen overflow-x-hidden antialiased relative`}>
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
