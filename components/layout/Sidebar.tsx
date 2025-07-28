"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, List, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Map", href: "/dashboard/map", icon: MapPin },
  { label: "List", href: "/dashboard/list", icon: List },
  { label: "Stats", href: "/dashboard/stats", icon: BarChart2 },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 bg-white border-r">
      <ul className="p-4 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center p-2 rounded hover:bg-gray-100",
                pathname.startsWith(href) && "bg-gray-100"
              )}
            >
              <Icon className="mr-3" size={20} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
