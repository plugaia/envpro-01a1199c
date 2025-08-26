import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, FileText, Calendar, DollarSign, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock proposal data - In a real app, this would come from an API
const mockProposal = {
  id: "prop-123",
  clientName: "KETLLEN SAMARA RODRIGUES LEMOS ROMANINI",
  processNumber: "0843335-72.2013.8.12.0001",
  organizationName: "INSS",
  cedibleValue: 71507.00,
  proposalValue: 39329.00,
  receiverType: "precatorio" as const,
  status: "pendente" as const,
  createdAt: new Date("2025-06-03T19:55:00"),
  validUntil: new Date("2025-07-03T23:59:59"),
  description: "Proposta de antecipação de crédito judicial para processo trabalhista. Seu futuro está nas suas mãos! Antecipe seus créditos judiciais e abra caminho para novas possibilidades.",
};

const ProposalView = () => {
  const { proposalId } = useParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'pendente' | 'aprovada' | 'rejeitada'>('pendente');
  
  // In a real app, you'd fetch the proposal by ID
  if (!proposalId || proposalId !== mockProposal.id) {
    return <Navigate to="/404" replace />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAccept = () => {
    setStatus('aprovada');
    toast({
      title: "Proposta Aprovada!",
      description: "Sua proposta foi aprovada com sucesso. Em breve entraremos em contato.",
    });
  };

  const handleReject = () => {
    setStatus('rejeitada');
    toast({
      title: "Proposta Rejeitada",
      description: "Sua resposta foi registrada. Obrigado pelo seu tempo.",
    });
  };

  const statusConfig = {
    pendente: { color: "bg-warning text-warning-foreground", label: "Aguardando Resposta" },
    aprovada: { color: "bg-success text-success-foreground", label: "Proposta Aprovada" },
    rejeitada: { color: "bg-destructive text-destructive-foreground", label: "Proposta Rejeitada" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="hero-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Proposta de Antecipação
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {mockProposal.description}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-12">
        {/* Status Card */}
        <Card className="card-elegant mb-8 overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cara(o) Sr(a).</p>
                <h2 className="text-2xl font-bold text-foreground">
                  {mockProposal.clientName}
                </h2>
              </div>
              <Badge className={statusConfig[status].color}>
                {statusConfig[status].label}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              Para a apresentação da proposta levamos em consideração o tipo de precatório, a ordem cronológica e o prazo estimado para recebimento. Diante do grande atraso previsto para o pagamento do seu crédito, antecipar o seu recebimento lhe trará o efetivo resultado do processo judicial e o poderá utilizar seu dinheiro da forma que quiser.
            </p>

            {/* Process Details */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                PROCESSO DEVEDOR VALOR CEDÍVEL
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-1">Número do processo</p>
                  <p className="text-sm text-muted-foreground">{mockProposal.processNumber}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-1">Nome do Órgão/Devedor</p>
                  <p className="text-sm text-muted-foreground">{mockProposal.organizationName}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-1">Valor Cedível</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(mockProposal.cedibleValue)}</p>
                </div>
              </div>
            </div>

            {/* Proposal Approved */}
            <div className="flex items-center justify-between bg-muted rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16">
                  <img src="/placeholder.svg" alt="Dinheiro" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Proposta Aprovada</h3>
                  <p className="text-sm text-muted-foreground">Pagamento garantido pelo Wone Bank</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(mockProposal.proposalValue)}
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mb-8">
              <p>A presente proposta não tem força pré-contratual, estando sujeita à aprovação da saúde fiscal do cedente e análise processual.</p>
            </div>

            {/* Action Buttons */}
            {status === 'pendente' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleAccept}
                  size="lg"
                  className="bg-success hover:bg-success/90 text-success-foreground px-8"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Aceitar Proposta
                </Button>
                <Button 
                  onClick={handleReject}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <X className="w-5 h-5 mr-2" />
                  Recusar Proposta
                </Button>
              </div>
            )}

            {status === 'aprovada' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-success mb-2">Proposta Aprovada!</h3>
                <p className="text-muted-foreground">Em breve entraremos em contato para prosseguir com o processo.</p>
              </div>
            )}

            {status === 'rejeitada' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-destructive-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-destructive mb-2">Proposta Recusada</h3>
                <p className="text-muted-foreground">Agradecemos pela consideração. Caso mude de opinião, entre em contato conosco.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            Válida até: {formatDate(mockProposal.validUntil)}
          </p>
          <p>© 2025 LegalProp - Plataforma de Propostas Jurídicas</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalView;