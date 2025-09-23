"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BrainCircuit,
  LayoutGrid,
  Lightbulb,
  Rocket,
  Target,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Dashboard",
  },
  {
    href: "/learn",
    icon: Lightbulb,
    label: "Learn",
  },
  {
    href: "/strategist",
    icon: Target,
    label: "Strategist",
  },
  {
    href: "/skills",
    icon: Award,
    label: "Skills",
  },
  {
    href: "/memory-palace",
    icon: BrainCircuit,
    label: "Memory Palace",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Rocket className="w-8 h-8 text-primary" />
          <span className="text-xl font-headline font-semibold">
            Smart Education
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={isMobile ? undefined : item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/user/40/40" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Alex Ryder</span>
            <span className="text-xs text-muted-foreground">
              alex.ryder@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </div>
  );
}
