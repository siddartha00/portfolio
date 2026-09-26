import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sai Siddartha Alleni | Robotics Software Engineer",
  description: "Portfolio of Sai Siddartha Alleni, a Purdue Robotics M.Eng. graduate focused on reinforcement learning, robot perception, and autonomous navigation.",
  keywords: ["robotics", "reinforcement learning", "autonomous navigation", "computer vision", "ROS 2", "Purdue University"],
  authors: [{ name: "Sai Siddartha Alleni" }],
  openGraph: {
    title: "Sai Siddartha Alleni | Robotics Software Engineer",
    description: "Robotics portfolio focused on reinforcement learning, robot perception, and autonomous navigation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Siddartha Alleni | Robotics Software Engineer",
    description: "Robotics portfolio focused on reinforcement learning, robot perception, and autonomous navigation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
