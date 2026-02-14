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
});

export const metadata: Metadata = {
  title: "MeliScribe Pro - AI Transcription",
  description: "Transcribe audio to text in minutes with AI-powered precision. Speaker diarization, 90+ languages, human-level accuracy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
