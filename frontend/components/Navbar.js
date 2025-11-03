'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from 'lucide-react';
import AuthModal from './AuthModal'; // <-- new modal component

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Offers', href: '/offers' },
    { name: 'B & B', href: '/bnb' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className="bg-[#FCFBF5] border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* Navbar Container */}
        <div className="flex items-center justify-between px-6 py-3 md:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="U&I Logo" className="h-10 w-auto select-none" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-black font-medium relative group"
              >
                {link.name}
                {link.name === 'Shop' && (
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Icons + Login */}
          <div className="hidden md:flex items-center space-x-5 text-gray-800">
            <Search className="w-5 h-5 cursor-pointer hover:text-black" />
            <Heart className="w-5 h-5 cursor-pointer hover:text-black" />
            <div className="relative cursor-pointer hover:text-black">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full px-[5px]">
                3
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center space-x-2 border border-gray-400 rounded-md px-3 py-1 text-sm hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#FCFBF5] px-6 py-4 space-y-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-800 hover:text-black font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4 mt-4">
              <Search className="w-5 h-5" />
              <Heart className="w-5 h-5" />
              <ShoppingBag className="w-5 h-5" />
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2 border border-gray-400 rounded-md px-3 py-1 text-sm hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* AUTH MODAL */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}