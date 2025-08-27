import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Save } from "lucide-react";
import { profileUpdateSchema } from "@/lib/validation";

export function ProfileSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_id: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: user.email || "",
        company_id: data.company_id || ""
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Validate input
      const validatedData = profileUpdateSchema.parse({
        firstName: profile.first_name,
        lastName: profile.last_name
      });

      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log the profile update
      await supabase.rpc('create_audit_log', {
        p_action_type: 'PROFILE_UPDATE',
        p_table_name: 'profiles',
        p_new_data: { 
          first_name: validatedData.firstName, 
          last_name: validatedData.lastName 
        }
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: error.errors?.[0]?.message || "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardContent>
    </Card>
  );
}