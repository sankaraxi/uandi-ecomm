// components/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Home,
  Box,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  FileText,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "Products", icon: Box, href: "/products" },
  { title: "Orders", icon: ShoppingBag, href: "/orders" },
  { title: "Customers", icon: Users, href: "/customers" },
  { title: "Payments", icon: CreditCard, href: "/payments" },
  { title: "Promotions", icon: Tag, href: "/promotions" },
  { title: "Content", icon: FileText, href: "/content" },
  { title: "Security Roles", icon: Shield, href: "/security-roles" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar  collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-sidebar-foreground/70">
          © 2025 Pixelantra
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}