import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface SendInvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
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

    const { email, firstName, lastName, whatsappNumber }: SendInvitationRequest = await req.json();

    if (!email || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Email, first name, and last name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT
    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { authorization: authHeader }
        }
      }
    );

    console.log('Creating team invitation with params:', {
      p_email: email,
      p_first_name: firstName,
      p_last_name: lastName,
      p_whatsapp_number: whatsappNumber
    });

    // First test if pgcrypto is available
    console.log('Testing pgcrypto extension...');
    const { data: testData, error: testError } = await userSupabase
      .rpc('get_user_company_id', { user_id: (await userSupabase.auth.getUser()).data.user?.id });
    
    console.log('Company ID test result:', { testData, testError });

    // Create team invitation using the user's context
    const { data: invitationData, error: invitationError } = await userSupabase
      .rpc('create_team_invitation', {
        p_email: email,
        p_first_name: firstName,
        p_last_name: lastName,
        p_whatsapp_number: whatsappNumber
      });

    console.log('Invitation creation result:', { invitationData, invitationError });

    if (invitationError) {
      console.error('Invitation creation error:', invitationError);
      return new Response(
        JSON.stringify({ error: invitationError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!invitationData || invitationData.length === 0) {
      console.error('No invitation data returned');
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation - no data returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const invitationToken = invitationData[0]?.invitation_token;
    
    if (!invitationToken) {
      console.error('No invitation token in data:', invitationData);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation - no token generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get company info for the email - use service role to get user info
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
      (await userSupabase.auth.getUser()).data.user?.id || ''
    );
    
    if (userError || !user) {
      console.error('User error:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to get user information' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's profile and company
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, companies(*)')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyName = profile.companies?.name || 'LegalProp';
    const inviterName = `${profile.first_name} ${profile.last_name}`;
    const registrationUrl = `https://409390a7-b191-4aa2-80d6-e46a971d8713.sandbox.lovable.dev/convite/${invitationToken}`;

    // Send invitation email
    const emailResponse = await resend.emails.send({
      from: `${companyName} <onboarding@resend.dev>`,
      to: [email],
      subject: `Convite para fazer parte da equipe ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite para Equipe</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Você foi convidado!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Faça parte da nossa equipe</p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #495057; margin-top: 0;">Olá, ${firstName}!</h2>
            <p>Você foi convidado por <strong>${inviterName}</strong> para fazer parte da equipe da <strong>${companyName}</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Dados do convite:</h3>
              <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${whatsappNumber ? `<p><strong>WhatsApp:</strong> ${whatsappNumber}</p>` : ''}
              <p><strong>Empresa:</strong> ${companyName}</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${registrationUrl}" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              🚀 Aceitar Convite e Criar Conta
            </a>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>⏰ Importante:</strong> Este convite expira em 7 dias. Clique no link acima para criar sua conta.
            </p>
          </div>

          <div style="border-top: 1px solid #dee2e6; padding-top: 20px; text-align: center; color: #6c757d; font-size: 14px;">
            <p>Este é um convite da plataforma ${companyName}.</p>
            <p>Se você não esperava este convite, pode ignorar este email.</p>
            <p>© ${new Date().getFullYear()} ${companyName} - Plataforma de Propostas Jurídicas</p>
          </div>

        </body>
        </html>
      `,
    });

    console.log('Invitation email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        invitationId: invitationData[0]?.invitation_id,
        message: `Convite enviado para ${email}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Team invitation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send team invitation', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});