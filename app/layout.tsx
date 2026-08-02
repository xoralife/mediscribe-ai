import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
