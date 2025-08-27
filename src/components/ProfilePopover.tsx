import { User, Settings, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface ProfilePopoverProps {
  children: React.ReactNode;
}

export function ProfilePopover({ children }: ProfilePopoverProps) {
  const userInfo = {
    name: "João Silva",
    email: "joao.silva@escritorio.com",
    role: "Advogado Senior"
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
              <p className="text-xs text-muted-foreground">{userInfo.role}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start text-sm h-8">
            <User className="w-4 h-4 mr-2" />
            Meu Perfil
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm h-8">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm h-8">
            <Shield className="w-4 h-4 mr-2" />
            Privacidade
          </Button>
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start text-sm h-8 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}