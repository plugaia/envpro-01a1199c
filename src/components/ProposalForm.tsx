import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Send, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProposalFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export function ProposalForm({ onClose, onSubmit }: ProposalFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "", 
    clientPhone: "",
    processNumber: "",
    organizationName: "",
    cedibleValue: "",
    proposalValue: "",
    receiverType: "advogado" as "advogado" | "autor" | "precatorio",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar propostas.",
        variant: "destructive",
      });
      return;
    }
    
    // Validação básica
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone || 
        !formData.cedibleValue || !formData.proposalValue) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get user's company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Perfil de usuário não encontrado');
      }

      // Create proposal (with temporary values for required fields, sensitive data in separate table)
      const proposalData = {
        company_id: profile.company_id,
        client_name: formData.clientName,
        client_email: 'temp@example.com', // Temporary value, will be removed later
        client_phone: '+55000000000', // Temporary value, will be removed later
        process_number: formData.processNumber || null,
        organization_name: formData.organizationName || null,
        cedible_value: parseFloat(formData.cedibleValue.replace(/[^\d,]/g, '').replace(',', '.')),
        proposal_value: parseFloat(formData.proposalValue.replace(/[^\d,]/g, '').replace(',', '.')),
        receiver_type: formData.receiverType,
        description: formData.description || null,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      const { data: proposalResult, error: proposalError } = await supabase
        .from('proposals')
        .insert([proposalData])
        .select()
        .single();

      if (proposalError) throw proposalError;

      // Insert client contact data in separate table
      const { error: contactError } = await supabase
        .from('client_contacts')
        .insert([{
          proposal_id: proposalResult.id,
          email: formData.clientEmail,
          phone: formData.clientPhone
        }]);

      if (contactError) throw contactError;

      toast({
        title: "Proposta criada",
        description: "A proposta foi criada com sucesso!",
      });
      
      onSubmit();
      onClose();
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Erro ao criar proposta",
        description: "Não foi possível criar a proposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const handleCurrencyChange = (field: 'cedibleValue' | 'proposalValue') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: formatCurrency(value)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Preencha os dados da proposta:</CardTitle>
            <Badge className="mt-2 bg-success text-success-foreground">Envio Ativo</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Information */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Informações do Cliente
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome Completo*</Label>
                  <Input
                    id="clientName"
                    placeholder="Nome completo do cliente"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">E-mail*</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="cliente@email.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone/WhatsApp*</Label>
                <Input
                  id="clientPhone"
                  placeholder="+55 67 99999-9999"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Process Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processNumber">Número do processo:</Label>
                <Input
                  id="processNumber"
                  placeholder="Informe o número do processo..."
                  value={formData.processNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, processNumber: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizationName">Nome do Órgão/Devedor</Label>
                <Input
                  id="organizationName"
                  placeholder="Nome da instituição"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                />
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedibleValue">Valor Cedível*</Label>
                <Input
                  id="cedibleValue"
                  placeholder="R$ 00,00"
                  value={formData.cedibleValue}
                  onChange={handleCurrencyChange('cedibleValue')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proposalValue">Valor da proposta Aprovada*</Label>
                <Input
                  id="proposalValue"
                  placeholder="R$ 00,00"
                  value={formData.proposalValue}
                  onChange={handleCurrencyChange('proposalValue')}
                  required
                />
              </div>
            </div>

            {/* Receiver Type */}
            <div className="space-y-3">
              <Label>Selecione o tipo do recebedor*</Label>
              <RadioGroup
                value={formData.receiverType}
                onValueChange={(value: "advogado" | "autor" | "precatorio") => 
                  setFormData(prev => ({ ...prev, receiverType: value }))
                }
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advogado" id="advogado" />
                  <Label htmlFor="advogado">Advogado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="autor" id="autor" />
                  <Label htmlFor="autor">Autor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="precatorio" id="precatorio" />
                  <Label htmlFor="precatorio">Precatório</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Descrição adicional da proposta..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "SALVANDO..." : "SALVAR PROPOSTA"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}