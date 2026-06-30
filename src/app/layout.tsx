import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { profile } from "@/content/data";

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

const siteName = `${profile.name} `;
const siteTitle = `${profile.name} `;
const siteDescription =
  `${profile.name}的个人站。曾从事 C++ 开发，现专注 AI 应用与工具实践，记录独立开发与小工具探索过程。`;

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: siteTitle,
    template: `%s · ${profile.name}`,
  },
  description: siteDescription,
  keywords: [
    "C++",
    "MFC",
    "Win32",
    "工具开发",
    "tooling developer",
    "游戏 UGC",
    "AI 工具",
    "独立开发",
    "Next.js",
    "blog",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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
