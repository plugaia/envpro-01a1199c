import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeneratePDFRequest {
  proposalId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { proposalId }: GeneratePDFRequest = await req.json();

    if (!proposalId) {
      return new Response(
        JSON.stringify({ error: 'Proposal ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get proposal data (without sensitive contact info)
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*, companies(name, cnpj)')
      .eq('id', proposalId)
      .single();

    if (proposalError || !proposal) {
      console.error('Proposal fetch error:', proposalError);
      return new Response(
        JSON.stringify({ error: 'Proposal not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client contact data using secure function
    const { data: contactData, error: contactError } = await supabase
      .rpc('get_client_contact', { p_proposal_id: proposalId });

    if (contactError || !contactData || contactData.length === 0) {
      console.error('Contact data fetch error:', contactError);
      return new Response(
        JSON.stringify({ error: 'Contact information not accessible or not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientContact = contactData[0];

    const companyName = proposal.companies?.name || 'Empresa';
    const companyCnpj = proposal.companies?.cnpj || '';
    
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    const formatDate = (date: string) => {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date));
    };

    // Generate HTML for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Proposta ${proposalId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; }
          .header { background: #667eea; color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0; }
          .section { margin-bottom: 25px; }
          .client-info { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .process-details { border: 1px solid #dee2e6; padding: 20px; border-radius: 8px; }
          .values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .value-item { text-align: center; padding: 15px; background: #f1f3f4; border-radius: 6px; }
          .value-item .label { font-size: 12px; color: #666; margin-bottom: 5px; }
          .value-item .amount { font-size: 18px; font-weight: bold; }
          .proposal-value { background: #e3f2fd; color: #1976d2; }
          .footer { border-top: 1px solid #dee2e6; padding-top: 20px; text-align: center; color: #666; font-size: 12px; }
          .disclaimer { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Proposta de Antecipação</h1>
          <p>Seu futuro está nas suas mãos! Antecipe seus créditos judiciais.</p>
        </div>

        <div class="section client-info">
          <h2>Dados do Cliente</h2>
          <p><strong>Nome:</strong> ${proposal.client_name}</p>
          <p><strong>Email:</strong> ${clientContact.email}</p>
          <p><strong>Telefone:</strong> ${clientContact.phone}</p>
        </div>

        ${proposal.process_number || proposal.organization_name ? `
        <div class="section process-details">
          <h3>Informações do Processo</h3>
          ${proposal.process_number ? `<p><strong>Número do Processo:</strong> ${proposal.process_number}</p>` : ''}
          ${proposal.organization_name ? `<p><strong>Órgão/Devedor:</strong> ${proposal.organization_name}</p>` : ''}
          <p><strong>Tipo:</strong> ${proposal.receiver_type}</p>
        </div>
        ` : ''}

        <div class="section">
          <h3>Valores</h3>
          <div class="values-grid">
            <div class="value-item">
              <div class="label">Valor Cedível</div>
              <div class="amount">${formatCurrency(proposal.cedible_value)}</div>
            </div>
            <div class="value-item proposal-value">
              <div class="label">Proposta Aprovada</div>
              <div class="amount">${formatCurrency(proposal.proposal_value)}</div>
            </div>
          </div>
        </div>

        ${proposal.description ? `
        <div class="section">
          <h3>Descrição</h3>
          <p>${proposal.description}</p>
        </div>
        ` : ''}

        <div class="disclaimer">
          <strong>Aviso:</strong> A presente proposta não tem força pré-contratual, estando sujeita à aprovação da saúde fiscal do cedente e análise processual.
        </div>

        <div class="footer">
          <p><strong>Empresa:</strong> ${companyName} ${companyCnpj ? `- CNPJ: ${companyCnpj}` : ''}</p>
          <p><strong>Data de Criação:</strong> ${formatDate(proposal.created_at)}</p>
          <p><strong>Válida até:</strong> ${formatDate(proposal.valid_until)}</p>
          <p>© ${new Date().getFullYear()} ${companyName} - Plataforma de Propostas Jurídicas</p>
        </div>
      </body>
      </html>
    `;

    // For this demo, we'll return the HTML content that can be used by the frontend to generate PDF
    // In a production environment, you would use a library like puppeteer-core to generate the actual PDF
    return new Response(
      JSON.stringify({ 
        success: true,
        htmlContent,
        fileName: `proposta-${proposalId}.pdf`,
        proposal: {
          id: proposal.id,
          clientName: proposal.client_name,
          proposalValue: formatCurrency(proposal.proposal_value)
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});