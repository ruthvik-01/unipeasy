
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BrainCircuit,
  LayoutGrid,
  Lightbulb,
  Rocket,
  Target,
  User,
  LogOut,
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
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";

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
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  }

  if (!isClient) {
    return null;
  }

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
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/40/40`} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{user?.displayName || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </div>
  );
}
