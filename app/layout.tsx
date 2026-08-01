import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "MediScribe AI — Conversations become clinical records",
    template: "%s · MediScribe AI",
  },
  description:
    "Turn doctor–patient conversations into structured, editable SOAP notes with Generative AI — reviewed and approved by a doctor before a patient ever sees them.",
  metadataBase: new URL("https://mediscribe.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrument.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
