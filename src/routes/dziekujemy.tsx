import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { LegalShell } from "@/components/legal-shell";

const searchSchema = z.object({
  order: z.string().trim().min(1).max(64).optional(),
  order_id: z.string().trim().min(1).max(64).optional(),
  id: z.string().trim().min(1).max(64).optional(),
  total: z.string().trim().max(32).optional(),
  currency: z.string().trim().max(8).optional(),
  items: z.coerce.number().int().nonnegative().optional(),
  status: z.string().trim().max(32).optional(),
});

export const Route = createFileRoute("/dziekujemy")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Dziękujemy za zamówienie – Pufkuj" },
      {
        name: "description",
        content:
          "Potwierdzenie zamówienia w sklepie Pufkuj. Sprawdź numer zamówienia i podsumowanie po zakupie.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dziękujemy za zamówienie – Pufkuj" },
      {
        property: "og:description",
        content: "Potwierdzenie zamówienia w sklepie Pufkuj.",
      },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const search = Route.useSearch();
  const orderNumber = search.order ?? search.order_id ?? search.id ?? null;
  const status = search.status ?? null;

  const totalFormatted = (() => {
    if (!search.total) return null;
    const asNumber = Number(search.total.replace(",", "."));
    if (!Number.isFinite(asNumber)) return search.total;
    const currency = (search.currency ?? "PLN").toUpperCase();
    try {
      return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency,
      }).format(asNumber);
    } catch {
      return `${asNumber.toFixed(2)} ${currency}`;
    }
  })();

  return (
    <LegalShell title="Dziękujemy za zamówienie!">
      <p className="contactLead">
        Twoje zamówienie zostało opłacone. Potwierdzenie i szczegóły wysyłki dostaniesz mailem w
        ciągu kilku minut. Sprawdź też folder „Oferty” lub „Spam”.
      </p>

      <section className="contactCard" aria-label="Podsumowanie zamówienia">
        {orderNumber ? (
          <div>
            <p className="eyebrow">Numer zamówienia</p>
            <strong style={{ fontSize: "1.25rem", letterSpacing: "0.02em" }}>
              #{orderNumber}
            </strong>
          </div>
        ) : (
          <div>
            <p className="eyebrow">Numer zamówienia</p>
            <span>Zostanie przesłany mailem</span>
          </div>
        )}

        {totalFormatted && (
          <div>
            <p className="eyebrow">Kwota</p>
            <strong>{totalFormatted}</strong>
          </div>
        )}

        {typeof search.items === "number" && search.items > 0 && (
          <div>
            <p className="eyebrow">Liczba pozycji</p>
            <span>
              {search.items} {search.items === 1 ? "maskotka" : "maskotek"}
            </span>
          </div>
        )}

        {status && (
          <div>
            <p className="eyebrow">Status</p>
            <span>{status}</span>
          </div>
        )}
      </section>

      <h2>Co dalej?</h2>
      <ol>
        <li>
          Sprawdź maila z potwierdzeniem zamówienia — tam znajdziesz dane do wysyłki.
        </li>
        <li>Pakujemy maskotki ręcznie zwykle w 2–5 dni roboczych.</li>
        <li>
          W razie pytań napisz na{" "}
          <a href="mailto:kontakt@pufkuj.pl">kontakt@pufkuj.pl</a> — najlepiej z numerem
          zamówienia.
        </li>
      </ol>

      <p className="documentHint">
        <Link to="/">← Wróć do sklepu</Link>
      </p>
    </LegalShell>
  );
}
