import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, Plus } from "lucide-react";

interface HeaderProps {
  onNewProposal: () => void;
}

export function Header({ onNewProposal }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
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
        
        <Button variant="ghost" size="sm">
          <Bell className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}