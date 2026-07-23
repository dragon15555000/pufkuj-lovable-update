import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function requireAdmin() {
  const { getRequest } = await import("@tanstack/react-start/server");
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = authHeader.slice("Bearer ".length);
  if (token.split(".").length !== 3) throw new Error("Invalid token");

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  
  const { data: claims } = await supabase.auth.getClaims(token);
  const appRole = claims?.claims?.app_role;
  if (appRole !== "admin") throw new Error("Forbidden: require admin");
  
  return true;
}

export const listAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return { products: data ?? [] };
});

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(100).optional(),
  name: z.string().min(2).max(200),
  short_description: z.string().nullable().optional(),
  description_md: z.string().nullable().optional(),
  price_grosze: z.number().int().positive(),
  currency: z.string().default("PLN"),
  image_path: z.string().nullable().optional(),
  image_path_hover: z.string().nullable().optional(),
  image_alt: z.string().nullable().optional(),
  quantity_limit: z.number().int().nullable().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  yarn_type: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => productSchema.parse(raw))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Auto-generate slug if missing
    let finalSlug = data.slug;
    if (!finalSlug && data.name) {
      finalSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (data.id) {
      const { id, ...updates } = data;
      if (finalSlug) updates.slug = finalSlug;
      const { error } = await supabaseAdmin
        .from("products")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      if (!finalSlug) throw new Error("Slug is required and could not be generated");
      const { id, ...inserts } = data;
      const { error } = await supabaseAdmin
        .from("products")
        .insert({ ...inserts, slug: finalSlug });
      if (error) throw new Error(error.message);
    }
    return { success: true };
  });

const deleteInput = z.object({ id: z.string() });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => deleteInput.parse(raw))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const importFrom1Koszyk = createServerFn({ method: "POST" })
  .handler(async () => {
    await requireAdmin();
    const apiKey = process.env.ONECART_API_KEY;
    const clientId = process.env.ONECART_CLIENT_ID;
    const apiUrl = process.env.ONECART_API_URL ?? "https://api.1cart.eu/v1";

    if (!apiKey || !clientId) throw new Error("Brak kluczy 1koszyk w .env");

    const response = await fetch(`${apiUrl}/products/all?disabled=0`, {
      headers: { "X-API-key": apiKey, "X-client-id": clientId },
    });
    
    if (!response.ok) throw new Error(`1koszyk API error: ${response.status}`);
    
    const json = await response.json();
    const rawProducts = json?.data?.products || [];
    
    if (rawProducts.length === 0) return { success: true, count: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let imported = 0;
    for (const rp of rawProducts) {
      let finalSlug = rp.name?.toLowerCase().replace(/[^a-z0-9\u0100-\u024F]+/g, '-').replace(/^-|-$/g, '');
      if (!finalSlug) continue;

      let price = 0;
      if (rp.price) {
        if (typeof rp.price === "number") price = Math.round(rp.price * 100);
        else if (typeof rp.price === "string") price = Math.round(parseFloat(rp.price.replace(",", ".")) * 100);
        else if (rp.price.amount) price = Math.round(parseFloat(String(rp.price.amount).replace(",", ".")) * 100);
      }
      if (!price) price = 1000;

      const { error } = await supabaseAdmin.from("products").insert({
        slug: finalSlug + "-" + Math.floor(Math.random()*1000), // zapobiega konfliktom
        name: rp.name || "Nieznany",
        short_description: rp.short_description || null,
        price_grosze: price,
        is_active: true,
        sort_order: imported,
      });

      if (!error) imported++;
    }

    return { success: true, count: imported };
  });
