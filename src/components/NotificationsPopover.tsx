import { Bell, Check, X, Clock, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface NotificationsPopoverProps {
  children: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'proposal' | 'client' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova proposta criada',
    message: 'Proposta para Maria Santos foi criada com sucesso',
    time: '5 min',
    read: false,
    type: 'proposal'
  },
  {
    id: '2',
    title: 'Cliente respondeu',
    message: 'João Oliveira aceitou a proposta #123',
    time: '1 hora',
    read: false,
    type: 'client'
  },
  {
    id: '3',
    title: 'Lembrete',
    message: 'Reunião com cliente às 15:00',
    time: '2 horas',
    read: true,
    type: 'system'
  },
  {
    id: '4',
    title: 'Nova mensagem',
    message: 'Ana Costa enviou uma mensagem',
    time: '1 dia',
    read: true,
    type: 'client'
  }
];

export function NotificationsPopover({ children }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <FileText className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-6"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg mb-2 border cursor-pointer transition-colors ${
                  notification.read 
                    ? 'bg-muted/30 border-transparent' 
                    : 'bg-card border-border hover:bg-muted/50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${
                    notification.read ? 'bg-muted' : 'bg-primary/10'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium text-sm ${
                        notification.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-2">
          <Button variant="ghost" className="w-full text-sm h-8">
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}