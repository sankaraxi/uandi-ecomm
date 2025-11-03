import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import Navbar from "@/components/Navbar";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata = {
  title: "U&I Store",
  description: "Shop your favorites effortlessly",
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#FCFBF5] text-gray-900`}
      >
        <ReduxProvider>
          {/* <Navbar /> */}
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
