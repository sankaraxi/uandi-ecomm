"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  ListChecks,
  Eye,
  Key,
  LogOut,
  MapPinIcon,
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile", path: "/profile" },
    { icon: <MapPin size={18} />, label: "Delivery Address", path: "/profile/address" },
    { icon: <ShoppingBag size={18} />, label: "Order History", path: "/profile/orders" },
    {icon:<MapPinIcon size={18} />, label: "Track Your Order", path: "/profile/track-order" },
    // { icon: <ListChecks size={18} />, label: "My Top Products", path: "/profile/products" },
    // { icon: <Eye size={18} />, label: "Recently Viewed", path: "/profile/viewed" },
    // { icon: <Key size={18} />, label: "Change Password", path: "/profile/password" },
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#f9fafb] lg:border-r border-b lg:border-b-0 border-gray-200 p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="hidden lg:flex items-center mb-6 md:mb-8">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-300" />
        <div className="ml-3">
          <p className="text-gray-800 font-medium text-sm">U&I Member Section</p>
        </div>
      </div>

      {/* Mobile Tabs (Horizontal scroll) */}
      <nav className="lg:hidden -mx-1 overflow-x-auto">
        <div className="flex items-center gap-2 px-1 pb-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition-colors ${
                pathname === item.path
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col space-y-3 text-gray-700 font-medium">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              pathname === item.path
                ? 'bg-green-100 text-green-700 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
