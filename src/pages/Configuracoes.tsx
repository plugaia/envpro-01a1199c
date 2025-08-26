import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Mail, Bell, Shield, Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados estão sendo preparados para download.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Configurações</h1>
                  <p className="text-sm text-muted-foreground">Gerencie as configurações da sua conta</p>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Informações do Perfil</CardTitle>
                  </div>
                  <CardDescription>
                    Atualize suas informações pessoais e profissionais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" placeholder="Seu nome completo" defaultValue="Dr. Giuvana Vargas" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" defaultValue="giuvana.vargas@wonebank.com.br" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(11) 99999-9999" defaultValue="+5567999909195" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oab">OAB</Label>
                      <Input id="oab" placeholder="SP123456" defaultValue="SP987654" />
                    </div>
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary-hover">
                    Salvar Informações
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <CardTitle>Notificações</CardTitle>
                  </div>
                  <CardDescription>
                    Configure como você deseja receber notificações sobre suas propostas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba emails quando houver atualizações em suas propostas
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba mensagens no WhatsApp sobre status das propostas
                      </p>
                    </div>
                    <Switch
                      id="whatsapp-notifications"
                      checked={whatsappNotifications}
                      onCheckedChange={setWhatsappNotifications}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Salvamento Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Salve automaticamente rascunhos de propostas
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <CardTitle>Segurança</CardTitle>
                  </div>
                  <CardDescription>
                    Mantenha sua conta segura e protegida
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" placeholder="Digite sua senha atual" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" placeholder="Digite a nova senha" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirme a nova senha" />
                    </div>
                  </div>
                  <Button variant="outline">
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Dados</CardTitle>
                  <CardDescription>
                    Exporte, importe ou exclua seus dados da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleExportData}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar Dados
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Importar Dados
                    </Button>
                  </div>
                  <Separator />
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">Zona de Perigo</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Esta ação é irreversível. Todos os seus dados, propostas e configurações serão permanentemente excluídos.
                    </p>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Excluir Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Versão atual e informações técnicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Versão da Plataforma</p>
                      <p className="text-sm text-muted-foreground">LegalProp v1.0.0</p>
                    </div>
                    <Badge variant="secondary">Atualizada</Badge>
                  </div>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Configuracoes;