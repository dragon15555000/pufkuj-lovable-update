import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin, listAllOrders } from "@/lib/admin-orders.functions";
import { listAllProducts } from "@/lib/admin-products.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const sectionH = { fontSize: 16, fontWeight: 600, borderBottom: "1px solid #eee", paddingBottom: 8, marginBottom: 12 };
const btnGhost = { padding: "6px 12px", border: "1px solid #ddd", background: "transparent", cursor: "pointer", borderRadius: 4, textDecoration: "none", color: "#000", fontSize: 14, display: "inline-block" };

function formatPln(grosze: number | null | undefined) {
  if (!grosze) return "0,00 zł";
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(grosze / 100);
}

function AdminDashboard() {
  const fetchIsAdmin = useServerFn(checkIsAdmin);
  const fetchOrders = useServerFn(listAllOrders);
  const fetchProducts = useServerFn(listAllProducts);

  const adminQ = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => fetchIsAdmin(),
  });

  const ordersQ = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchOrders({ data: { status: "all" } }),
    enabled: !!adminQ.data?.isAdmin,
  });

  const productsQ = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchProducts(),
    enabled: !!adminQ.data?.isAdmin,
  });

  if (adminQ.isLoading) return <div style={{ padding: 40 }}>Sprawdzanie uprawnień...</div>;
  if (!adminQ.data?.isAdmin) return <div style={{ padding: 40, color: "red" }}>Odmowa dostępu. Zaloguj się jako administrator.</div>;

  const orders = ordersQ.data?.orders || [];
  const products = productsQ.data?.products || [];

  // Wyliczanie finansów (tylko opłacone i wysłane z bieżącego miesiąca)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let incomeThisMonth = 0;
  let itemsSoldThisMonth = 0;

  const recentOrders = orders.filter(o => {
    const isSuccess = o.status === "paid" || o.status === "shipped";
    const d = new Date(o.created_at);
    if (isSuccess && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      incomeThisMonth += (o.items_total_grosze || 0); // liczymy sam utarg za produkty
      
      const items = Array.isArray(o.items) ? o.items : [];
      itemsSoldThisMonth += items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
      return true;
    }
    return false;
  });

  // Zapas kończący się (< 3 sztuki, ale większy niż 0)
  const lowStock = products.filter(p => p.quantity_limit !== null && p.quantity_limit > 0 && p.quantity_limit <= 3);
  // Wyprzedane
  const outOfStock = products.filter(p => p.quantity_limit === 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: "0 0 8px 0" }}>Pufkuj · Dashboard</h1>
          <p style={{ margin: 0, color: "#666" }}>Podsumowanie sklepu na ten miesiąc</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/admin/orders" style={btnGhost}>Zamówienia</Link>
          <Link to="/admin/products" style={btnGhost}>Produkty</Link>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 40 }}>
        <div style={{ padding: 24, borderRadius: 8, border: "1px solid #ddd", background: "#f9fafb" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14, textTransform: "uppercase" }}>Przychód (Produkty)</h3>
          <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "#111" }}>{formatPln(incomeThisMonth)}</p>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 13 }}>W tym miesiącu (bez wysyłek)</p>
        </div>
        <div style={{ padding: 24, borderRadius: 8, border: "1px solid #ddd", background: "#f9fafb" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14, textTransform: "uppercase" }}>Sprzedane Maskotki</h3>
          <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "#111" }}>{itemsSoldThisMonth} szt.</p>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 13 }}>W tym miesiącu</p>
        </div>
        <div style={{ padding: 24, borderRadius: 8, border: "1px solid #ddd", background: "#f9fafb" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#666", fontSize: 14, textTransform: "uppercase" }}>Do wysłania</h3>
          <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "#eab308" }}>{orders.filter(o => o.status === "paid").length}</p>
          <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 13 }}>Czekają na paczkę</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <h2 style={sectionH}>⚠️ Kończące się zapasy</h2>
          {lowStock.length === 0 ? (
            <p style={{ color: "#666" }}>Wszystko w normie. Niczego nie brakuje.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {lowStock.map(p => (
                <li key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                  <span>{p.name}</span>
                  <strong style={{ color: "#f97316" }}>Zostało: {p.quantity_limit} szt.</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 style={sectionH}>❌ Wyprzedane (Ukryte)</h2>
          {outOfStock.length === 0 ? (
            <p style={{ color: "#666" }}>Brak wyprzedanych produktów.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {outOfStock.map(p => (
                <li key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                  <span style={{ color: "#999", textDecoration: "line-through" }}>{p.name}</span>
                  <strong style={{ color: "#ef4444" }}>0 szt.</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
