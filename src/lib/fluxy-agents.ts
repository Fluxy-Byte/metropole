/**
 * Client for the Fluxy Agents platform (Agent-Api) — server-to-server calls
 * authenticated with a shared internal API key (x-internal-api-key), same
 * pattern as the AXEL_API_KEY guard on our own /api/whatsapp/* routes.
 */

/**
 * Fires the "metropole_boas_vindas" active WhatsApp campaign (via the "max"
 * agent) for a brand-new lead. Best-effort: a failure here must never break
 * the contact-form response — the lead is already saved regardless.
 */
export async function triggerWelcomeCampaign(phone: string, name: string): Promise<void> {
  const baseUrl = process.env.FLUXY_AGENT_API_URL;
  const apiKey = process.env.FLUXY_INTERNAL_API_KEY;
  if (!baseUrl || !apiKey) {
    console.error("[fluxy-agents] FLUXY_AGENT_API_URL/FLUXY_INTERNAL_API_KEY não configurados — campanha de boas-vindas não disparada.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/internal/campaigns/metropole-welcome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": apiKey,
      },
      body: JSON.stringify({ phone, name }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      console.error(`[fluxy-agents] Falha ao disparar campanha de boas-vindas (${response.status}):`, body);
    }
  } catch (error) {
    console.error("[fluxy-agents] Erro ao chamar a Fluxy Agents para disparar a campanha de boas-vindas:", error);
  }
}
