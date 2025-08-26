import { useState, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { type Proposal } from "@/components/ProposalCard";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalFilters, type FilterOptions } from "@/components/ProposalFilters";
import { ProposalList } from "@/components/ProposalList";
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
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    receiverType: [],
    dateFrom: undefined,
    dateTo: undefined,
    minValue: undefined,
    maxValue: undefined,
  });

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

  // Filter proposals based on active filters
  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          proposal.clientName.toLowerCase().includes(searchLower) ||
          proposal.clientEmail.toLowerCase().includes(searchLower) ||
          (proposal.processNumber && proposal.processNumber.toLowerCase().includes(searchLower)) ||
          (proposal.organizationName && proposal.organizationName.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(proposal.status)) {
        return false;
      }

      // Receiver type filter
      if (filters.receiverType.length > 0 && !filters.receiverType.includes(proposal.receiverType)) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && proposal.createdAt < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (proposal.createdAt > endOfDay) {
          return false;
        }
      }

      // Value range filter
      if (filters.minValue && proposal.proposalValue < filters.minValue) {
        return false;
      }
      if (filters.maxValue && proposal.proposalValue > filters.maxValue) {
        return false;
      }

      return true;
    });
  }, [proposals, filters]);

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

              {/* Filters */}
              <ProposalFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={proposals.length}
                filteredCount={filteredProposals.length}
              />

              {/* Proposals List */}
              <ProposalList
                proposals={filteredProposals}
                onSendEmail={handleSendEmail}
                onSendWhatsApp={handleSendWhatsApp}
                onView={handleViewProposal}
              />
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