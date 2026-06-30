import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import "./globals.css";
import ShaderBackground from "@/components/ui/ShaderBackground";
import CursorGlow from "@/components/ui/CursorGlow";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CourseVault AI - Your AI Study Universe",
  description: "Organize BRACU courses, save resources in 3D folder galaxies, and find study notes with Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceMono.variable} h-full antialiased dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col relative text-white bg-[#0b1326] font-sans selection:bg-purple-900 selection:text-purple-100">
        <ShaderBackground />
        <CursorGlow />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
