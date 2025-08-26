import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProposalFormProps {
  onClose: () => void;
  onSubmit: (proposalData: any) => void;
}

export function ProposalForm({ onClose, onSubmit }: ProposalFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    processNumber: "",
    organizationName: "",
    cedibleValue: "",
    proposalValue: "",
    receiverType: "advogado" as "advogado" | "autor" | "precatorio",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.clientName || !formData.clientEmail || !formData.cedibleValue || !formData.proposalValue) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const proposalData = {
      ...formData,
      cedibleValue: parseFloat(formData.cedibleValue.replace(/[^\d,]/g, '').replace(',', '.')),
      proposalValue: parseFloat(formData.proposalValue.replace(/[^\d,]/g, '').replace(',', '.')),
      id: crypto.randomUUID(),
      status: "pendente" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmit(proposalData);
    toast({
      title: "Proposta criada",
      description: "A proposta foi criada com sucesso!",
    });
    onClose();
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente*</Label>
                <Input
                  id="clientName"
                  placeholder="Nome completo"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">E-mail do cliente*</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="Informe o melhor e-mail..."
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  required
                />
              </div>
            </div>

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

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8"
              >
                <Send className="w-4 h-4 mr-2" />
                SALVAR PROPOSTA
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}