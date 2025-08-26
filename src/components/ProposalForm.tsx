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
import { Client, mockClients } from "@/types/client";

interface ProposalFormProps {
  onClose: () => void;
  onSubmit: (proposalData: any) => void;
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
}

export function ProposalForm({ onClose, onSubmit, onAddClient }: ProposalFormProps) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    processNumber: "",
    organizationName: "",
    cedibleValue: "",
    proposalValue: "",
    receiverType: "advogado" as "advogado" | "autor" | "precatorio",
  });

  // New client form data
  const [newClientData, setNewClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient && !showNewClientForm) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione um cliente ou crie um novo.",
        variant: "destructive",
      });
      return;
    }

    if (showNewClientForm) {
      if (!newClientData.firstName || !newClientData.lastName || !newClientData.email || !newClientData.whatsapp) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos do novo cliente.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!formData.cedibleValue || !formData.proposalValue) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    let clientInfo;
    if (showNewClientForm) {
      // Create new client
      const newClient: Client = {
        id: crypto.randomUUID(),
        ...newClientData,
        createdAt: new Date(),
      };
      setClients(prev => [...prev, newClient]);
      onAddClient(newClientData);
      clientInfo = {
        clientName: `${newClientData.firstName} ${newClientData.lastName}`,
        clientEmail: newClientData.email,
        clientWhatsapp: newClientData.whatsapp,
      };
    } else {
      // Use selected client
      clientInfo = {
        clientName: `${selectedClient!.firstName} ${selectedClient!.lastName}`,
        clientEmail: selectedClient!.email,
        clientWhatsapp: selectedClient!.whatsapp,
      };
    }

    const proposalData = {
      ...formData,
      ...clientInfo,
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
            {/* Client Selection */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações do Cliente
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewClientForm(!showNewClientForm)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  {showNewClientForm ? "Selecionar Existente" : "Novo Cliente"}
                </Button>
              </div>

              {!showNewClientForm ? (
                // Client Selection
                <div className="space-y-2">
                  <Label htmlFor="client-select">Selecionar Cliente*</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um cliente..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-md z-50">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{client.firstName} {client.lastName}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                // New Client Form
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome*</Label>
                      <Input
                        id="firstName"
                        placeholder="Nome"
                        value={newClientData.firstName}
                        onChange={(e) => setNewClientData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome*</Label>
                      <Input
                        id="lastName"
                        placeholder="Sobrenome"
                        value={newClientData.lastName}
                        onChange={(e) => setNewClientData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newClientEmail">E-mail*</Label>
                    <Input
                      id="newClientEmail"
                      type="email"
                      placeholder="cliente@email.com"
                      value={newClientData.email}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp*</Label>
                    <Input
                      id="whatsapp"
                      placeholder="+55 67 99999-9999"
                      value={newClientData.whatsapp}
                      onChange={(e) => setNewClientData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              )}
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