import { DM_Sans } from "next/font/google";

import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import CartModal from "@/components/CartModal";
import WishlistModal from "@/components/WishlistModal";

// Load fonts

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
        className={`${dmSans.variable} ${mainFont.variable} font-submain bg-white text-gray-900`}
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
