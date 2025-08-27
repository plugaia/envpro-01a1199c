import { FileText, Plus, BarChart3, Settings, Users, Mail, Moon, Sun, Monitor } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Propostas", url: "/", icon: FileText },
  { title: "Nova Proposta", url: "/nova", icon: Plus },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} bg-sidebar border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border bg-sidebar">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Mail className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">LegalProp</h2>
                <p className="text-xs text-sidebar-foreground/70">Propostas Jurídicas</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup className="bg-sidebar">
          <SidebarGroupLabel className={`text-sidebar-foreground/70 text-xs font-medium ${
            collapsed ? "sr-only" : "px-4 py-2"
          }`}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="bg-sidebar">
            <SidebarMenu className={`space-y-1 ${collapsed ? "px-1" : "px-2"}`}>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center rounded-lg text-sm font-medium transition-colors ${
                          collapsed 
                            ? "justify-center p-2 mx-1" 
                            : "gap-3 px-3 py-2"
                        } ${
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className={`${collapsed ? "px-1" : "px-3"} py-3`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "sm" : "default"}
                className={`${
                  collapsed 
                    ? "w-10 h-10 p-0 mx-auto" 
                    : "w-full justify-start"
                } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
                {!collapsed && <span className="ml-2">Tema</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side={collapsed ? "right" : "top"}>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}