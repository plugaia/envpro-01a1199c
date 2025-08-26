import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProposalCard, type Proposal } from "@/components/ProposalCard";
import { ProposalForm } from "@/components/ProposalForm";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockProposals: Proposal[] = [
  {
    id: "prop-123",
    clientName: "VALDENIR LOURENÇO MARTINS",
    clientEmail: "valdenir@email.com",
    processNumber: "0843335-72.2013.8.12.0001",
    organizationName: "INSS",
    cedibleValue: 399694.00,
    proposalValue: 199847.00,
    receiverType: "precatorio",
    status: "pendente",
    createdAt: new Date("2025-06-05T17:20:00"),
    updatedAt: new Date("2025-06-05T17:20:00"),
    assignee: "Giuvana",
  },
  {
    id: "prop-124", 
    clientName: "KETLLEN SAMARA RODRIGUES LEMOS ROMANINI",
    clientEmail: "ketllen@email.com",
    processNumber: "0843335-72.2013.8.12.0002",
    organizationName: "INSS",
    cedibleValue: 71507.00,
    proposalValue: 39329.00,
    receiverType: "precatorio",
    status: "aprovada",
    createdAt: new Date("2025-06-03T19:55:00"),
    updatedAt: new Date("2025-06-03T19:55:00"),
    assignee: "Giuvana",
  },
  {
    id: "prop-125",
    clientName: "JOANA DARC FERREIRA BORGES", 
    clientEmail: "joana@email.com",
    processNumber: "0843335-72.2013.8.12.0003",
    organizationName: "INSS",
    cedibleValue: 71057.00,
    proposalValue: 35528.50,
    receiverType: "precatorio",
    status: "rejeitada",
    createdAt: new Date("2025-06-03T19:33:00"),
    updatedAt: new Date("2025-06-03T19:33:00"),
    assignee: "Giuvana",
  }
];

const Index = () => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const handleNewProposal = () => {
    setShowProposalForm(true);
  };

  const handleSubmitProposal = (proposalData: any) => {
    const newProposal: Proposal = {
      ...proposalData,
      assignee: "Sistema", // Default assignee
    };
    setProposals(prev => [newProposal, ...prev]);
  };

  const handleSendEmail = (proposal: Proposal) => {
    // Create professional email with proposal link
    const subject = encodeURIComponent(`Proposta Jurídica - ${proposal.clientName}`);
    const body = encodeURIComponent(
      `Prezado(a) ${proposal.clientName},

Temos uma proposta de antecipação de crédito judicial para análise.

Detalhes da Proposta:
• Processo: ${proposal.processNumber || 'N/A'}
• Valor Cedível: R$ ${proposal.cedibleValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
• Valor da Proposta: R$ ${proposal.proposalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}

Para visualizar e responder à proposta, acesse:
${window.location.origin}/proposta/${proposal.id}

Atenciosamente,
Equipe LegalProp`
    );
    
    window.open(`mailto:${proposal.clientEmail}?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Email preparado",
      description: `Cliente de email aberto para ${proposal.clientEmail}`,
    });
  };

  const handleSendWhatsApp = (proposal: Proposal) => {
    // Create WhatsApp message with proposal link
    const message = encodeURIComponent(
      `Olá ${proposal.clientName}! 

Temos uma proposta de antecipação de crédito judicial de *R$ ${proposal.proposalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}* para seu processo.

Para visualizar os detalhes e aceitar a proposta, clique no link:
${window.location.origin}/proposta/${proposal.id}

Equipe LegalProp 📋⚖️`
    );
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp aberto", 
      description: `Mensagem preparada para ${proposal.clientName}`,
    });
  };

  const handleViewProposal = (proposal: Proposal) => {
    // Open proposal view in new tab
    window.open(`/proposta/${proposal.id}`, '_blank');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header onNewProposal={handleNewProposal} />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Propostas Jurídicas
                </h2>
                <p className="text-muted-foreground">
                  Gerencie e envie suas propostas para clientes via email ou WhatsApp
                </p>
              </div>

              {proposals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma proposta encontrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando sua primeira proposta jurídica
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      onSendEmail={handleSendEmail}
                      onSendWhatsApp={handleSendWhatsApp}
                      onView={handleViewProposal}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {showProposalForm && (
          <ProposalForm
            onClose={() => setShowProposalForm(false)}
            onSubmit={handleSubmitProposal}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;