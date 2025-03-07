import { Info, Leaf, Home, Compass, MapPin } from "lucide-react";
import { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
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

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}
export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  chartsNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    { title: "About", href: "/about", icon: Info },
    { title: "Environment & Ethics", href: "/environment-ethics", icon: Info },
    { title: "Accommodation", href: "/accommodation", icon: Home },
    { title: "Activities", href: "/activities", icon: Compass },
    { title: "Routes", href: "/sectors", icon: MapPin },
  ],
};
