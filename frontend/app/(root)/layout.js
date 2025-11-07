'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/ReduxProvider";
import CartModal from "@/components/CartModal";
import { fetchCart } from '@/store/slices/cartSlice';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function CartInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return null;
}

export default function Layout({ children }) {
  return (
    <ReduxProvider>
      <CartInitializer />
      <div
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#FCFBF5] text-gray-900`}
      >
        <Navbar />
        <main>{children}</main>
        <CartModal />
      </div>
    </ReduxProvider>
  );
}
