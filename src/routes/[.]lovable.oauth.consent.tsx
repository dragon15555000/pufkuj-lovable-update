import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthorizationDetails = {
  client?: { name?: string; redirect_uri?: string };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: Error | null }>;
  approveAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: Error | null }>;
  denyAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: Error | null }>;
};

function authOAuth(): AuthOAuth {
  return (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { next: location.pathname + location.searchStr },
      });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.searchStr).get("authorization_id")!;
    const { data, error } = await authOAuth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
      throw new Error("redirecting");
    }
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <div className="legalPage">
      <div className="legalDocument shell">
        <h1>Nie udało się wczytać żądania autoryzacji</h1>
        <p>{String((error as Error)?.message ?? error)}</p>
      </div>
    </div>
  ),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await authOAuth().approveAuthorization(authorization_id)
      : await authOAuth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Brak adresu powrotu z serwera autoryzacji.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "aplikacja zewnętrzna";

  return (
    <div className="legalPage">
      <div className="legalDocument shell" style={{ maxWidth: 520 }}>
        <h1>Połącz {clientName} z Twoim kontem Pufkuj</h1>
        <p>
          {clientName} otrzyma dostęp do wybranych narzędzi MCP i będzie działać w Twoim imieniu
          (np. odczyt Twoich zamówień). Możesz odłączyć dostęp w dowolnym momencie.
        </p>
        <p style={{ fontSize: 14, opacity: 0.75 }}>
          Uprawnienia aplikacji zależą od reguł tego sklepu — dostęp zostanie ograniczony do Twoich
          danych.
        </p>
        {error && <p role="alert" style={{ color: "#b00020" }}>{error}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="button" className="orderCta" onClick={() => decide(true)} disabled={busy}>
            {busy ? "Chwila…" : "Zezwól"}
          </button>
          <button
            type="button"
            onClick={() => decide(false)}
            disabled={busy}
            style={{ background: "none", border: "1px solid #ccc", padding: "10px 18px", borderRadius: 6, cursor: "pointer" }}
          >
            Odrzuć
          </button>
        </div>
      </div>
    </div>
  );
}
