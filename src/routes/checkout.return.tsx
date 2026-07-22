import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { LegalShell } from "@/components/legal-shell";
import { confirmCheckout } from "@/lib/checkout.functions";

const searchSchema = z.object({
  session_id: z.string().trim().min(5).max(200).optional(),
  cancelled: z.string().optional(),
});

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Potwierdzam płatność… – Pufkuj" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const confirm = useServerFn(confirmCheckout);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!session_id) {
      setError("Brak identyfikatora sesji płatności w adresie.");
      return;
    }
    let cancelled = false;

    const run = async () => {
      try {
        // Poll a few times: Stripe status may briefly lag behind the redirect.
        for (let i = 0; i < 6 && !cancelled; i += 1) {
          setAttempt(i + 1);
          const result = await confirm({ data: { sessionId: session_id } });
          if (cancelled) return;
          if (!result.found) {
            setError("Nie znaleziono zamówienia dla tej sesji.");
            return;
          }
          if (result.status === "paid") {
            const total = (result.total_grosze / 100).toFixed(2);
            navigate({
              to: "/dziekujemy",
              search: {
                order: result.orderId,
                total,
                currency: result.currency,
                items: result.itemsCount,
                status: "paid",
              },
              replace: true,
            });
            return;
          }
          if (result.status === "failed" || result.status === "cancelled") {
            setError(
              result.status === "cancelled"
                ? "Płatność została anulowana."
                : "Płatność nie doszła do skutku.",
            );
            return;
          }
          await new Promise((r) => setTimeout(r, 1200));
        }
        if (!cancelled) {
          setError(
            "Nie udało się jeszcze potwierdzić płatności. Sprawdź skrzynkę mailową lub odśwież tę stronę.",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Nieznany błąd.");
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [session_id, confirm, navigate]);

  return (
    <LegalShell title="Potwierdzam płatność…">
      {error ? (
        <>
          <p className="contactLead">{error}</p>
          <p>
            <a href="/checkout">Wróć do formularza</a> lub napisz na{" "}
            <a href="mailto:kontakt@pufkuj.pl">kontakt@pufkuj.pl</a>.
          </p>
        </>
      ) : (
        <p className="contactLead">
          Weryfikuję Twoją płatność u Stripe (próba {attempt}/6). Zaraz Cię przekieruję…
        </p>
      )}
    </LegalShell>
  );
}
