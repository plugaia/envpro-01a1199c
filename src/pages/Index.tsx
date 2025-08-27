import { useState, useMemo, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { type Proposal } from "@/components/ProposalCard";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalFilters, type FilterOptions } from "@/components/ProposalFilters";
import { ProposalList } from "@/components/ProposalList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    receiverType: [],
    dateFrom: undefined,
    dateTo: undefined,
    minValue: undefined,
    maxValue: undefined,
  });

  // Fetch proposals on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user]);

  const fetchProposals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match Proposal interface
      const transformedProposals: Proposal[] = data.map(proposal => ({
        id: proposal.id,
        clientName: proposal.client_name,
        clientEmail: proposal.client_email,
        processNumber: proposal.process_number,
        organizationName: proposal.organization_name,
        cedibleValue: parseFloat(proposal.cedible_value.toString()),
        proposalValue: parseFloat(proposal.proposal_value.toString()),
        receiverType: proposal.receiver_type as "advogado" | "autor" | "precatorio",
        status: proposal.status as "pendente" | "aprovada" | "rejeitada",
        createdAt: new Date(proposal.created_at),
        updatedAt: new Date(proposal.updated_at),
        assignee: "Sistema", // TODO: Get from created_by relation
      }));

      setProposals(transformedProposals);
      
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Erro ao carregar propostas",
        description: "Não foi possível carregar as propostas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewProposal = () => {
    setShowProposalForm(true);
  };

  const handleSubmitProposal = () => {
    // Refresh proposals list after creating a new one
    fetchProposals();
  };

  const handleSendEmail = async (proposal: Proposal) => {
    try {
      const response = await supabase.functions.invoke('send-proposal-email', {
        body: { proposalId: proposal.id }
      });

      if (response.error) throw response.error;

      toast({
        title: "Email enviado!",
        description: `Proposta enviada para ${proposal.clientEmail}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = (proposal: Proposal) => {
    // Create WhatsApp message with proposal link using client's WhatsApp number
    const message = encodeURIComponent(
      `Olá ${proposal.clientName}! 

Temos uma proposta de antecipação de crédito judicial de *R$ ${proposal.proposalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}* para seu processo.

Para visualizar os detalhes e aceitar a proposta, clique no link:
${window.location.origin}/proposta/${proposal.id}

Equipe LegalProp 📋⚖️`
    );
    
    // Use client's WhatsApp number if available, otherwise fallback to generic WhatsApp
    const whatsappNumber = (proposal as any).clientWhatsapp || "";
    const whatsappUrl = whatsappNumber 
      ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${message}`
      : `https://wa.me/?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto", 
      description: whatsappNumber 
        ? `Conversa iniciada com ${proposal.clientName}`
        : `Mensagem preparada para ${proposal.clientName}`,
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
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ProposalList
                  proposals={filteredProposals}
                  onSendEmail={handleSendEmail}
                  onSendWhatsApp={handleSendWhatsApp}
                  onView={handleViewProposal}
                />
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