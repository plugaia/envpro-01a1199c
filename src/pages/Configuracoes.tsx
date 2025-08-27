import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BackupExport } from "@/components/BackupExport";
import { AuditLogs } from "@/components/AuditLogs";
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Save
} from "lucide-react";

export default function Configuracoes() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_id: ""
  });
  const [company, setCompany] = useState({
    name: "",
    cnpj: "",
    responsible_phone: "",
    responsible_email: "",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_city: "",
    address_state: "",
    address_zip_code: ""
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError) throw companyError;

      setProfile({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: user?.email || "",
        company_id: profileData.company_id
      });

      setCompany(companyData);

      // Load saved preferences
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setNotifications(prefs.notifications || notifications);
        setTheme(prefs.theme || theme);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do usuário.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log the action
      await supabase.rpc('create_audit_log', {
        p_action_type: 'PROFILE_UPDATED',
        p_table_name: 'profiles',
        p_new_data: profile
      });

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update(company)
        .eq('id', profile.company_id);

      if (error) throw error;

      // Log the action
      await supabase.rpc('create_audit_log', {
        p_action_type: 'SETTINGS_UPDATED',
        p_table_name: 'companies',
        p_new_data: company
      });

      toast({
        title: "Empresa atualizada!",
        description: "Os dados da empresa foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar os dados da empresa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify({
      notifications,
      theme,
      savedAt: new Date().toISOString()
    }));

    toast({
      title: "Preferências salvas!",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="space-y-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input 
                  id="firstName" 
                  placeholder="Seu nome" 
                  value={profile.first_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input 
                  id="lastName" 
                  placeholder="Seu sobrenome" 
                  value={profile.last_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com"
                value={profile.email}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                O email não pode ser alterado por questões de segurança
              </p>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Configure os dados da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input 
                  id="companyName" 
                  placeholder="Nome da empresa" 
                  value={company.name}
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0001-00"
                  value={company.cnpj}
                  onChange={(e) => setCompany(prev => ({ ...prev, cnpj: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  placeholder="(11) 99999-9999"
                  value={company.responsible_phone}
                  onChange={(e) => setCompany(prev => ({ ...prev, responsible_phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email da Empresa</Label>
                <Input 
                  id="companyEmail" 
                  type="email" 
                  placeholder="contato@empresa.com"
                  value={company.responsible_email}
                  onChange={(e) => setCompany(prev => ({ ...prev, responsible_email: e.target.value }))}
                />
              </div>
            </div>
            
            {/* Endereço */}
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input 
                    id="street" 
                    placeholder="Nome da rua"
                    value={company.address_street || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_street: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input 
                    id="number" 
                    placeholder="123"
                    value={company.address_number || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input 
                    id="complement" 
                    placeholder="Sala 101"
                    value={company.address_complement || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_complement: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input 
                    id="neighborhood" 
                    placeholder="Centro"
                    value={company.address_neighborhood || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_neighborhood: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input 
                    id="city" 
                    placeholder="São Paulo"
                    value={company.address_city || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input 
                    id="state" 
                    placeholder="SP"
                    value={company.address_state || ""}
                    onChange={(e) => setCompany(prev => ({ ...prev, address_state: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input 
                  id="zipCode" 
                  placeholder="00000-000"
                  value={company.address_zip_code || ""}
                  onChange={(e) => setCompany(prev => ({ ...prev, address_zip_code: e.target.value }))}
                  className="max-w-xs"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSaveCompany} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Empresa"}
            </Button>
          </CardContent>
        </Card>

        {/* Preferências de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba updates importantes por email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push no navegador
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, push: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receba SMS para ações críticas
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={notifications.sms}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, sms: checked }))
                }
              />
            </div>
            <Button onClick={handleSavePreferences} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="flex gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex-1"
                >
                  Claro
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex-1"
                >
                  Escuro
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex-1"
                >
                  Sistema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Exportação */}
        <BackupExport />

        {/* Logs de Auditoria */}
        <AuditLogs />
      </div>
    </div>
  );
}