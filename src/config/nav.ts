import { Info, Leaf, Home, Compass, MapPin, UserIcon } from "lucide-react";
import type { Icons } from "@/components/icons";

export interface NavItem {
  name: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  iconSVG?: keyof typeof Icons;
  icon?: any;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {
  admin?: boolean;
}

export interface SidebarNavItem extends NavItemWithChildren {
  admin?: boolean;
}
export interface NavConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  chartsNav: SidebarNavItem[];
}

export const navConfig: NavConfig = {
  mainNav: [
    { name: "About", href: "/about", icon: Info, admin: false },
    // { name: "Environment & Ethics", href: "/environment-ethics", icon: Info },
    // { name: "Accommodation", href: "/accommodation", icon: Home },
    // { name: "Activities", href: "/activities", icon: Compass },
    { name: "Users", href: "/users", icon: UserIcon, admin: true },
    { name: "Routes", href: "/sectors", icon: MapPin, admin: false },
  ],
  sidebarNav: [],
  chartsNav: [],
};
