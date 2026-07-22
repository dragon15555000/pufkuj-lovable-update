import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

function normalizeEmail(input: unknown): string {
  if (typeof input !== "string") throw new Error("E-mail jest wymagany");
  const email = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    throw new Error("Nieprawidłowy adres e-mail");
  }
  return email;
}

async function findUserByEmail(admin: any, email: string) {
  // auth.admin.listUsers is paginated; scan up to 10 pages of 200 users.
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    const match = data?.users?.find(
      (u: any) => (u.email ?? "").toLowerCase() === email,
    );
    if (match) return match;
    if (!data?.users || data.users.length < 200) return null;
  }
  return null;
}

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const admins: Array<{
      id: string;
      user_id: string;
      email: string;
      created_at: string;
      is_self: boolean;
    }> = [];

    for (const r of roles ?? []) {
      const { data: u, error: uErr } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
      if (uErr) continue;
      admins.push({
        id: r.id,
        user_id: r.user_id,
        email: u?.user?.email ?? "(brak e-maila)",
        created_at: r.created_at,
        is_self: r.user_id === context.userId,
      });
    }

    return { admins };
  });

export const grantAdminByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string }) => ({ email: normalizeEmail(input?.email) }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const user = await findUserByEmail(supabaseAdmin, data.email);
    if (!user) {
      return {
        ok: false as const,
        code: "user_not_found" as const,
        message: "Ta osoba musi najpierw założyć konto na /auth, potem spróbuj ponownie.",
      };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.id, role: "admin" });
    // Ignore unique-violation (already admin)
    if (error && !/duplicate|unique/i.test(error.message)) {
      throw new Error(error.message);
    }

    return { ok: true as const, email: user.email, user_id: user.id };
  });

export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => {
    if (!input?.userId || typeof input.userId !== "string") {
      throw new Error("userId jest wymagany");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    if (data.userId === context.userId) {
      throw new Error("Nie możesz odebrać roli administratora samemu sobie.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);

    return { ok: true as const };
  });
