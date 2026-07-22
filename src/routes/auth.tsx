import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const searchSchema = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: safeNext(search.next) as "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Logowanie – Pufkuj" },
      {
        name: "description",
        content: "Zaloguj się do konta Pufkuj, aby przeglądać swoje zamówienia.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const target = safeNext(next);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: target as "/", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, target]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${target}`,
          },
        });
        if (error) throw error;
        setInfo("Sprawdź skrzynkę e-mail, aby potwierdzić konto.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }

  return (
    <div className="legalPage">
      <div className="legalDocument shell" style={{ maxWidth: 460 }}>
        <h1>{mode === "login" ? "Zaloguj się" : "Utwórz konto"}</h1>
        <p style={{ marginBottom: 20 }}>
          {mode === "login"
            ? "Zaloguj się, aby zobaczyć swoje zamówienia."
            : "Załóż konto, aby zapisywać historię zamówień."}
        </p>

        <button
          type="button"
          className="orderCta"
          onClick={handleGoogle}
          disabled={busy}
          style={{ width: "100%", marginBottom: 16 }}
        >
          Kontynuuj z Google
        </button>

        <div style={{ textAlign: "center", opacity: 0.6, margin: "8px 0" }}>lub</div>

        <form onSubmit={handleEmail} style={{ display: "grid", gap: 12 }}>
          <label>
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{ width: "100%", padding: 10, marginTop: 4 }}
            />
          </label>
          <label>
            Hasło
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{ width: "100%", padding: 10, marginTop: 4 }}
            />
          </label>
          {error && <p role="alert" style={{ color: "#b00020" }}>{error}</p>}
          {info && <p style={{ color: "#0a7d3b" }}>{info}</p>}
          <button type="submit" className="orderCta" disabled={busy}>
            {busy ? "Chwila…" : mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center" }}>
          {mode === "login" ? (
            <>
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{ background: "none", border: 0, color: "#b88ab8", cursor: "pointer" }}
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ background: "none", border: 0, color: "#b88ab8", cursor: "pointer" }}
              >
                Zaloguj się
              </button>
            </>
          )}
        </p>
        <p style={{ marginTop: 20, textAlign: "center" }}>
          <Link to="/">← Wróć do sklepu</Link>
        </p>
      </div>
    </div>
  );
}
