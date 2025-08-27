import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Bell, User, Plus, Menu, X } from "lucide-react";
import { ProfilePopover } from "./ProfilePopover";
import { NotificationsPopover } from "./NotificationsPopover";

interface HeaderProps {
  onNewProposal: () => void;
}

export function Header({ onNewProposal }: HeaderProps) {
  const { open } = useSidebar();
  
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </SidebarTrigger>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas propostas jurídicas</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onNewProposal}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Proposta
        </Button>
        
        <NotificationsPopover>
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
        </NotificationsPopover>
        
        <ProfilePopover>
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </ProfilePopover>
      </div>
    </header>
  );
}