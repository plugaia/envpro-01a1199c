import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { ProposalForm } from "@/components/ProposalForm";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showProposalForm, setShowProposalForm] = useState(false);

  const handleNewProposal = () => {
    setShowProposalForm(true);
  };

  const handleSubmitProposal = () => {
    setShowProposalForm(false);
    // Refresh will be handled by the parent component
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header onNewProposal={handleNewProposal} />
          <main className="flex-1 p-6 bg-muted/30">
            {children}
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
}