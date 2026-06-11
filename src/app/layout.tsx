import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Your Name — Developer & Creator",
    template: "%s · Your Name",
  },
  description:
    "Personal site of Your Name — a developer building things for the web. Projects, tech stack, experience and more.",
  keywords: [
    "developer",
    "portfolio",
    "frontend",
    "full-stack",
    "Next.js",
    "blog",
  ],
  authors: [{ name: "Your Name" }],
  openGraph: {
    type: "website",
    title: "Your Name — Developer & Creator",
    description:
      "Personal site of Your Name — a developer building things for the web.",
    siteName: "Your Name",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name — Developer & Creator",
    description:
      "Personal site of Your Name — a developer building things for the web.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div aria-hidden className="grain" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
