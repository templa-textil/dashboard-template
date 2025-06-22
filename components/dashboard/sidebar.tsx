"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Package, FileText, Receipt, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Plantillas",
    url: "/dashboard/templates",
    icon: FileText,
  },
  {
    title: "Facturación",
    url: "/dashboard/facturation",
    icon: Receipt,
  },
  {
    title: "Configuración",
    url: "/dashboard/configuration",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader
        onClick={() => {
          router.push("/dashboard");
        }}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Textil</span>
            <span className="truncate text-xs text-muted-foreground">
              {session?.user.name} - {session?.user.role}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <User className="h-4 w-4" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{session?.user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {session?.user.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
