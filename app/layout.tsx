import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";
import RouteTracker from "@/components/RouteTracker";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meliscribe.app"),
  title: {
    default: "MeliScribe Pro - AI Transcription & Audio to Text",
    template: "%s | MeliScribe Pro"
  },
  description: "Transcribe audio to text in minutes with AI-powered precision. Speaker diarization, 90+ languages, human-level accuracy for professionals.",
  keywords: ["AI Transcription", "Audio to Text", "Speech Recognition", "Whisper v3", "Speaker Diarization", "MeliScribe"],
  authors: [{ name: "MeliScribe" }],
  openGraph: {
    title: "MeliScribe Pro - AI Transcription",
    description: "Industry-standard AI transcription engine.",
    url: "https://meliscribe.app",
    siteName: "MeliScribe Pro",
    images: [{ url: "/og-image.png" }], // User should add this
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeliScribe Pro - AI Transcription",
    description: "Industry-standard AI transcription engine.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://analytics.ayris.tech" />
        <link rel="dns-prefetch" href="https://analytics.ayris.tech" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <PlausibleProvider 
          domain="meliscribe.app" 
          customDomain="https://analytics.ayris.tech"
          selfHosted
        >
          <RouteTracker />
          {children}
          {/* Self-hosted plausible script via local proxy */}
          <Script 
            defer 
            data-domain="meliscribe.app" 
            src="/pl.js" 
            strategy="afterInteractive"
          />
        </PlausibleProvider>
      </body>
    </html>
  );
}
