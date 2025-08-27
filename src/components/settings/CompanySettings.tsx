import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Save } from "lucide-react";
import { companyUpdateSchema } from "@/lib/validation";

export function CompanySettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    if (!user) return;

    try {
      // First get user's profile to find company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Then get company data
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) throw error;

      setCompany({
        name: data.name || "",
        cnpj: data.cnpj || "",
        responsible_phone: data.responsible_phone || "",
        responsible_email: data.responsible_email || "",
        address_street: data.address_street || "",
        address_number: data.address_number || "",
        address_complement: data.address_complement || "",
        address_neighborhood: data.address_neighborhood || "",
        address_city: data.address_city || "",
        address_state: data.address_state || "",
        address_zip_code: data.address_zip_code || ""
      });
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da empresa.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCompany = async () => {
    if (!user) return;

    try {
      // Validate input
      const validatedData = companyUpdateSchema.parse({
        name: company.name,
        cnpj: company.cnpj,
        responsiblePhone: company.responsible_phone,
        responsibleEmail: company.responsible_email,
        addressStreet: company.address_street || undefined,
        addressNumber: company.address_number || undefined,
        addressComplement: company.address_complement || undefined,
        addressNeighborhood: company.address_neighborhood || undefined,
        addressCity: company.address_city || undefined,
        addressState: company.address_state || undefined,
        addressZipCode: company.address_zip_code || undefined
      });

      setLoading(true);

      // Get user's profile to find company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('companies')
        .update({
          name: validatedData.name,
          cnpj: validatedData.cnpj,
          responsible_phone: validatedData.responsiblePhone,
          responsible_email: validatedData.responsibleEmail,
          address_street: validatedData.addressStreet,
          address_number: validatedData.addressNumber,
          address_complement: validatedData.addressComplement,
          address_neighborhood: validatedData.addressNeighborhood,
          address_city: validatedData.addressCity,
          address_state: validatedData.addressState,
          address_zip_code: validatedData.addressZipCode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.company_id);

      if (error) throw error;

      // Log the company update
      await supabase.rpc('create_audit_log', {
        p_action_type: 'COMPANY_UPDATE',
        p_table_name: 'companies',
        p_new_data: validatedData
      });

      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram salvos com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating company:', error);
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
          <Building2 className="h-5 w-5" />
          Dados da Empresa
        </CardTitle>
        <CardDescription>
          Gerencie as informações da sua empresa
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
            <Label htmlFor="responsiblePhone">Telefone Responsável</Label>
            <Input 
              id="responsiblePhone" 
              placeholder="+55 67 99999-9999" 
              value={company.responsible_phone}
              onChange={(e) => setCompany(prev => ({ ...prev, responsible_phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleEmail">Email Responsável</Label>
            <Input 
              id="responsibleEmail" 
              type="email"
              placeholder="responsavel@empresa.com" 
              value={company.responsible_email}
              onChange={(e) => setCompany(prev => ({ ...prev, responsible_email: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Endereço</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Rua</Label>
              <Input 
                id="street" 
                placeholder="Rua das Flores" 
                value={company.address_street}
                onChange={(e) => setCompany(prev => ({ ...prev, address_street: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input 
                id="number" 
                placeholder="123" 
                value={company.address_number}
                onChange={(e) => setCompany(prev => ({ ...prev, address_number: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input 
                id="complement" 
                placeholder="Apto 45" 
                value={company.address_complement}
                onChange={(e) => setCompany(prev => ({ ...prev, address_complement: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input 
                id="neighborhood" 
                placeholder="Centro" 
                value={company.address_neighborhood}
                onChange={(e) => setCompany(prev => ({ ...prev, address_neighborhood: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city" 
                placeholder="São Paulo" 
                value={company.address_city}
                onChange={(e) => setCompany(prev => ({ ...prev, address_city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input 
                id="state" 
                placeholder="SP" 
                maxLength={2}
                value={company.address_state}
                onChange={(e) => setCompany(prev => ({ ...prev, address_state: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input 
                id="zipCode" 
                placeholder="01234-567" 
                value={company.address_zip_code}
                onChange={(e) => setCompany(prev => ({ ...prev, address_zip_code: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSaveCompany} 
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