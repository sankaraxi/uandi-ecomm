import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import localFont from "next/font/local";
import CartModal from "@/components/CartModal";
import WishlistModal from "@/components/WishlistModal";
import { DM_Sans } from "next/font/google";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


const mainFont = localFont({
  src: [
    {
      path: "../public/fonts/Nohemi.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mainFont", // optional for CSS variables
});


// Metadata
export const metadata = {
  title: 'U&I Naturals',
  icons: {
    icon: '/favicon.svg', // your SVG favicon path
    // shortcut: '/favicon.ico',
    // apple: '/apple-touch-icon.png',
  },
};


// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${mainFont.variable} ${geistSans.variable} ${geistMono.variable} font-submain bg-white text-gray-900`}
      >
        <ReduxProvider>
          {/* <Navbar /> */}
          <main>{children}</main>
          <CartModal />
          <WishlistModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
