"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wallet,
  TrendingUp,
  Megaphone,
  Headphones,
  Monitor,
  ShoppingCart,
  Package,
  FolderKanban,
  Scale,
  Building2,
  Bot,
  BookOpen,
  Workflow,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "CEO Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Employees", href: "/ai-employees", icon: Bot },
  { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { divider: true },
  { name: "HR", href: "/hr", icon: Users },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "Sales", href: "/sales", icon: TrendingUp },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Customer Support", href: "/support", icon: Headphones },
  { name: "IT", href: "/it", icon: Monitor },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Legal", href: "/legal", icon: Scale },
  { name: "Admin", href: "/admin", icon: Building2 },
  { divider: true },
  { name: "Templates", href: "/templates", icon: Store },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">DST</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navigation.map((item, index) =>
            item.divider ? (
              <li key={`divider-${index}`} className="my-3 h-px bg-border" />
            ) : (
              <li key={item.name}>
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
