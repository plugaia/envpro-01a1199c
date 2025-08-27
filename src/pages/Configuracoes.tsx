import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, User, Mail, Bell, Shield, Download, Upload, Trash2, Users, UserPlus, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Configuracoes = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: ''
  });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      // Load saved settings
      const savedSettings = localStorage.getItem('user-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setEmailNotifications(settings.emailNotifications ?? true);
        setWhatsappNotifications(settings.whatsappNotifications ?? true);
        setAutoSave(settings.autoSave ?? true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin && user) {
      fetchTeamData();
    }
  }, [isAdmin, user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: adminCheck, error } = await supabase
        .rpc('is_admin', { user_id: user.id });
      
      if (error) throw error;
      setIsAdmin(adminCheck || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchTeamData = async () => {
    if (!isAdmin || !user) return;
    
    try {
      const companyId = await getUserCompanyId();
      
      // Fetch team members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, companies(name)')
        .eq('company_id', companyId);
      
      if (profilesError) throw profilesError;
      setTeamMembers(profiles || []);

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('status', 'pending')
        .eq('company_id', companyId);
      
      if (invitationsError) throw invitationsError;
      setPendingInvitations(invitations || []);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const getUserCompanyId = async () => {
    const { data, error } = await supabase
      .rpc('get_user_company_id', { user_id: user.id });
    if (error) throw error;
    return data;
  };

  const handleSendInvitation = async () => {
    if (!inviteData.firstName || !inviteData.lastName || !inviteData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, sobrenome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          email: inviteData.email,
          firstName: inviteData.firstName,
          lastName: inviteData.lastName,
          whatsappNumber: inviteData.whatsappNumber || null
        }
      });

      if (error) throw error;

      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${inviteData.email}`,
      });

      setShowInviteModal(false);
      setInviteData({ firstName: '', lastName: '', email: '', whatsappNumber: '' });
      fetchTeamData(); // Refresh data
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Erro ao enviar convite",
        description: error.message || "Ocorreu um erro ao enviar o convite.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const formatWhatsApp = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e) => {
    const formatted = formatWhatsApp(e.target.value);
    setInviteData(prev => ({ ...prev, whatsappNumber: formatted }));
  };

  const handleSaveSettings = async () => {
    try {
      // Save user preferences to localStorage for now
      const settings = {
        emailNotifications,
        whatsappNotifications,
        autoSave
      };
      localStorage.setItem('user-settings', JSON.stringify(settings));
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
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
                      <Label htmlFor="firstName">Nome</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Seu nome" 
                        defaultValue={user ? (user.user_metadata?.firstName || '') : ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Seu sobrenome" 
                        defaultValue={user ? (user.user_metadata?.lastName || '') : ''} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        defaultValue={user?.email || ''} 
                        disabled
                        className="opacity-70"
                      />
                      <p className="text-xs text-muted-foreground">O email não pode ser alterado aqui</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        placeholder="(11) 99999-9999" 
                        defaultValue={user ? (user.user_metadata?.phone || '') : ''} 
                      />
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

              {/* Team Management - Only for Admins */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <CardTitle>Gerenciamento de Equipe</CardTitle>
                    </div>
                    <CardDescription>
                      Gerencie membros da equipe e convites pendentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Invite New Member */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Membros da Equipe</h3>
                      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Convidar Membro
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Convidar Novo Membro</DialogTitle>
                            <DialogDescription>
                              Envie um convite para um novo membro se juntar à sua equipe
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">Nome</Label>
                                <Input
                                  id="firstName"
                                  value={inviteData.firstName}
                                  onChange={(e) => setInviteData(prev => ({ ...prev, firstName: e.target.value }))}
                                  placeholder="João"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Sobrenome</Label>
                                <Input
                                  id="lastName"
                                  value={inviteData.lastName}
                                  onChange={(e) => setInviteData(prev => ({ ...prev, lastName: e.target.value }))}
                                  placeholder="Silva"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={inviteData.email}
                                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="joao.silva@empresa.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                              <Input
                                id="whatsapp"
                                value={inviteData.whatsappNumber}
                                onChange={handleWhatsAppChange}
                                placeholder="(11) 99999-9999"
                                maxLength={15}
                              />
                            </div>
                            <Button 
                              onClick={handleSendInvitation} 
                              disabled={isInviting}
                              className="w-full"
                            >
                              {isInviting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Enviando...
                                </>
                              ) : (
                                'Enviar Convite'
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Current Team Members */}
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">{member.first_name} {member.last_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.role === 'admin' ? 'Administrador' : 'Colaborador'}
                            </p>
                          </div>
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {member.role === 'admin' ? 'Admin' : 'Membro'}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Pending Invitations */}
                    {pendingInvitations.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Convites Pendentes
                          </h4>
                          <div className="space-y-3">
                            {pendingInvitations.map((invitation) => (
                              <div key={invitation.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                                <div>
                                  <p className="font-medium">{invitation.first_name} {invitation.last_name}</p>
                                  <p className="text-sm text-muted-foreground">{invitation.email}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Expira em: {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                                <Badge variant="outline">Pendente</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

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