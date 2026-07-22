import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/lib/orders.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/moje-zamowienia")({
  head: () => ({
    meta: [
      { title: "Moje zamówienia – Pufkuj" },
      { name: "description", content: "Historia Twoich zamówień w sklepie Pufkuj." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyOrdersPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "Oczekuje na płatność",
  paid: "Opłacone",
  failed: "Nieudana płatność",
  cancelled: "Anulowane",
};

function formatPln(grosze: number, currency = "PLN") {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(grosze / 100);
}

function MyOrdersPage() {
  const fetchOrders = useServerFn(getMyOrders);
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchOrders(),
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="legalPage">
      <div className="legalDocument shell">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Moje zamówienia</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/" style={{ background: "none", border: "1px solid #b88ab8", color: "#5a3a5a", padding: "6px 14px", borderRadius: 6, textDecoration: "none", display: "inline-block" }}>
              ← Wróć do sklepu
            </Link>
            <button type="button" onClick={handleSignOut} style={{ background: "none", border: "1px solid #ccc", padding: "6px 12px", cursor: "pointer", borderRadius: 6 }}>
              Wyloguj
            </button>
          </div>
        </div>

        {isLoading && <p>Ładowanie…</p>}
        {error && <p role="alert" style={{ color: "#b00020" }}>Nie udało się pobrać zamówień.</p>}

        {data && data.orders.length === 0 && (
          <p style={{ marginTop: 24 }}>
            Nie masz jeszcze żadnych zamówień. <Link to="/">Wybierz coś w sklepie</Link>.
          </p>
        )}

        {data && data.orders.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "grid", gap: 12 }}>
            {data.orders.map((o) => {
              const items = Array.isArray(o.items) ? (o.items as Array<{ name?: string; quantity?: number }>) : [];
              return (
                <li key={o.id} style={{ border: "1px solid #e6d8e6", borderRadius: 8, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <strong>{new Date(o.created_at as string).toLocaleString("pl-PL")}</strong>
                    <span>{STATUS_LABEL[o.status as string] ?? o.status}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {items.map((it, i) => (
                      <div key={i}>
                        {(it.quantity ?? 1)} × {it.name ?? "produkt"}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>
                    {formatPln(o.total_grosze as number, (o.currency as string) ?? "PLN")}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
