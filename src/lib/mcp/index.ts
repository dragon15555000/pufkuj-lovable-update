import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import listMyOrdersTool from "./tools/list-my-orders";

// The direct Supabase host is the OAuth issuer (never the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

// MCP server with OPTIONAL OAuth:
// - `list_products` — publiczny katalog, dostępny bez logowania.
// - `list_my_orders` — dane osobiste, wymaga zalogowania (Supabase OAuth).
// Handler każdego narzędzia sam decyduje przez `ctx.isAuthenticated()`.
export default defineMcp({
  name: "pufki-mcp",
  title: "Pufkuj Handmade MCP",
  version: "0.2.0",
  instructions:
    "MCP sklepu Pufkuj. `list_products` — publiczny katalog. `list_my_orders` — historia zamówień zalogowanego użytkownika (wymaga OAuth).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProductsTool, listMyOrdersTool],
});
