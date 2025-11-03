import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({ children }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#FCFBF5] text-gray-900`}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
