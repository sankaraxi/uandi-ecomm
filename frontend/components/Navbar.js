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
  LogOut,
  UserCircle,
  Package,
  ChevronDown
} from 'lucide-react';
import AuthModal from './AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { openCart } from '@/store/slices/cartSlice';
import { logout } from '@/store/authSlice';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-300">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                  src="/logo.png"
                  alt="U&I Logo"
                  className="h-10 w-auto select-none"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      href={link.href}
                      className="relative text-gray-700 hover:text-black font-medium tracking-wide transition-all duration-150 group"
                  >
                    {link.name}
                    {/* Underline effect */}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-6 text-gray-700">
              <button aria-label="Search" className="hover:text-black transition">
                <Search className="w-5 h-5" />
              </button>
              <button aria-label="Wishlist" className="hover:text-black transition">
                <Heart className="w-5 h-5" />
              </button>
              <button
                  aria-label="Cart"
                  className="relative hover:text-black transition"
                  onClick={() => dispatch(openCart())}
              >
                <ShoppingBag className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full px-[5px]">
                    {items.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-100 active:scale-95 transition">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-5 h-5 rounded-full" />
                    ) : (
                      <UserCircle className="w-5 h-5" />
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 invisible">
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Package className="w-4 h-4" />
                      Orders
                    </Link>
                    <button
                      onClick={() => dispatch(logout())}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-100 active:scale-95 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
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
          <div
              className={`md:hidden overflow-hidden transition-all duration-300 ${
                  menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="bg-[#FCFBF5] border-t border-gray-200 px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-gray-800 hover:text-black font-medium text-base"
                  >
                    {link.name}
                  </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>

              <div className="flex items-center justify-between">
                <div className="flex gap-5">
                  <Search className="w-5 h-5 text-gray-700" />
                  <Heart className="w-5 h-5 text-gray-700" />
                  <ShoppingBag className="w-5 h-5 text-gray-700" onClick={() => dispatch(openCart())}/>
                </div>

                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-100 active:scale-95 transition">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-5 h-5 rounded-full" />
                      ) : (
                        <UserCircle className="w-5 h-5" />
                      )}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 invisible">
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Package className="w-4 h-4" />
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-100 active:scale-95 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Auth Modal */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
  );
}
