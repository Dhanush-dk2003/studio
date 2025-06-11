
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChartHorizontalBig, ListChecks, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/reports/call-detail", label: "Call Detail Report", icon: ListChecks },
  { href: "/reports/summary", label: "Summary Report", icon: BarChartHorizontalBig },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/reports/call-detail" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          <span className="text-xl font-headline font-semibold text-primary-foreground">Report Viewer</span>
        </Link>
      </div>
      <div className="flex-grow p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-sidebar-primary-foreground text-sidebar-primary" // Active state
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" // Inactive state
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
