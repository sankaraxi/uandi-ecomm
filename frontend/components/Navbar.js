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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { verifyUser, logout, refreshToken } from "@/store/authSlice";
import { openCart } from '@/store/slices/cartSlice';
import Image from 'next/image';

function getFirstName(user) {
  const first = user?.firstName || user?.first_name || '';
  const last = user?.lastName || user?.last_name || '';
  if (first) return first;
  const full = (user?.full_name || `${first} ${last}`).trim();
  return full.split(' ')[0] || 'User';
}

function getAvatar(user) {
  return (
    user?.profilePictureUrl ||
    user?.profile_picture_url ||
    user?.avatar_url ||
    user?.image_url ||
    null
  );
}


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

   const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

  const navLinks = [
    { name: 'Shop All', href: '/products' },
    { name: 'Currate Your Routine ', href: '/curate-your-routine' },
    { name: 'Collections', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'AI Skincare', href: '/ai-skincare' },
  ];

  useEffect(() => {
    // Don't verify if we're logging out
    if (!isLoggingOut &&!isAuthenticated && !loading) {
      dispatch(verifyUser())
        .unwrap()
        .catch((error) => {
          // console.error("Verify user error on dashboard:", error);
          if (error === "Invalid access token") {
            dispatch(refreshToken())
              .unwrap()
              .then(() => dispatch(verifyUser()))
              .catch(() => router.push("/"));
          } 
          // else {
          //   router.push("/");
          // }
        });
    }
  }, []);

  const handleLogout = (e) => {
    e.stopPropagation();
    // setDropdownOpen(false);
    setIsLoggingOut(true); // Set flag before logout
  
    dispatch(logout())
      .unwrap()
      .then(() => {
        setUserMenuOpen(false);
        router.push("/");
      })
      .catch(() => {
        setUserMenuOpen(false);
        router.push("/");
      });
  };
  const firstName = isAuthenticated ? getFirstName(user) : '';
  const avatarUrl = isAuthenticated ? getAvatar(user) : null;
  

  return (
    <>
      <nav className="bg-[#FCFBF5] border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* Navbar Container */}
        <div className="relative flex items-center justify-between px-4 py-6 md:px-8 lg:px-12">
          {/* LEFT SECTION - Navigation Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[9px] md:text-[10px] xl:text-[15px] text-gray-800 hover:text-black font-medium relative group transition-colors whitespace-nowrap"
              >
                {link.name}
                {link.name === 'Shop' && (
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                    <span className="w-1 h-1 bg-black rounded-full"></span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* MOBILE LEFT: Hamburger + Search */}
          <div className="flex items-center gap-3 md:hidden relative z-10">
            <button
              className="text-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button aria-label="Search" className="text-gray-800">
              <Search className="w-6 h-6" />
            </button>
          </div>

          {/* CENTER SECTION - Logo (Absolutely Positioned on all viewports; sits centered on mobile) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-main.png"
                alt="U&I Logo"
                width={120}
                height={40}
                className="select-none h-14 w-auto md:h-10 lg:h-18"
                priority
              />
            </Link>
          </div>

          {/* RIGHT SECTION - Icons & Login */}
          

            <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5 text-gray-800 ml-auto">
              <Search className="w-5 h-5 cursor-pointer hover:text-black" />
              <Heart className="w-5 h-5 cursor-pointer hover:text-black" />
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
  
              {/* USER / LOGIN */}
              {!isAuthenticated ? (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center space-x-2 border border-gray-400 rounded-md px-3 py-1 text-sm hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 border border-gray-300 rounded-md px-2.5 py-1 hover:bg-gray-100"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={firstName}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-800">{firstName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => { setUserMenuOpen(false); router.push('/profile'); }}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          {/* MOBILE RIGHT: Cart + User */}
          <div className="flex items-center gap-3 ml-auto md:hidden relative z-10">
            <button
              aria-label="Cart"
              className="relative text-gray-800"
              onClick={() => dispatch(openCart())}
            >
              <ShoppingBag className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full px-[5px]">
                  {items.length}
                </span>
              )}
            </button>
            {/* User avatar only on mobile */}
            {!isAuthenticated ? (
              <button
                aria-label="Login"
                onClick={() => setAuthModalOpen(true)}
                className="text-gray-800"
              >
                <User className="w-6 h-6" />
              </button>
            ) : (
              <div className="relative">
                <button
                  aria-label="User menu"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-gray-300"
                >
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={firstName} width={32} height={32} className="object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setUserMenuOpen(false); router.push('/profile'); }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
          </div>
        )}
      </nav>

      {/* AUTH MODAL */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}