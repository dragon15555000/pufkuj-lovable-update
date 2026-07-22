import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { startCheckout } from "@/lib/checkout.functions";
import { LegalShell } from "@/components/legal-shell";

type CartMap = Record<string, number>;
type CartSnapshotItem = {
  seller_id: string;
  name: string;
  price_grosze: number;
  quantity: number;
  image: string | null;
};

export const Route = createFileRoute("/checkout/")({
  head: () => ({
    meta: [
      { title: "Finalizacja zamówienia – Pufkuj" },
      {
        name: "description",
        content:
          "Podaj dane do wysyłki i przejdź do bezpiecznej płatności Stripe w sklepie Pufkuj.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Finalizacja zamówienia – Pufkuj" },
      {
        property: "og:description",
        content: "Bezpieczna płatność Stripe dla ręcznie robionych maskotek Pufkuj.",
      },
    ],
  }),
  component: CheckoutPage,
});

const SHIPPING_LABEL = "Kurier";
const SHIPPING_GROSZE = 1800;

function formatPln(grosze: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(grosze / 100);
}

type FormErrors = Partial<Record<
  "customerName" | "customerEmail" | "customerPhone" | "street" | "postalCode" | "city",
  string
>>;

function validate(values: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  postalCode: string;
  city: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (values.customerName.trim().length < 2) {
    errors.customerName = "Podaj imię i nazwisko.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.customerEmail.trim())) {
    errors.customerEmail = "Podaj poprawny adres e-mail.";
  }
  if (!/^[+0-9\s()-]{6,30}$/.test(values.customerPhone.trim())) {
    errors.customerPhone = "Podaj poprawny numer telefonu.";
  }
  if (values.street.trim().length < 3) {
    errors.street = "Podaj ulicę i numer.";
  }
  if (!/^\d{2}-\d{3}$/.test(values.postalCode.trim())) {
    errors.postalCode = "Kod pocztowy w formacie 00-000.";
  }
  if (values.city.trim().length < 2) {
    errors.city = "Podaj miasto.";
  }
  return errors;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const startCheckoutFn = useServerFn(startCheckout);

  const [snapshot, setSnapshot] = useState<CartSnapshotItem[] | null>(null);
  const [values, setValues] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    postalCode: "",
    city: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("pufki-cart-snapshot");
      if (raw) {
        const parsed = JSON.parse(raw) as CartSnapshotItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshot(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    setSnapshot([]);
  }, []);

  const itemsTotal = useMemo(
    () =>
      (snapshot ?? []).reduce(
        (sum, item) => sum + item.price_grosze * item.quantity,
        0,
      ),
    [snapshot],
  );
  const total = itemsTotal + SHIPPING_GROSZE;

  const update =
    (key: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!snapshot || snapshot.length === 0) {
      toast.error("Twój koszyk jest pusty. Dodaj maskotkę i wróć tutaj.");
      return;
    }
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Sprawdź pola formularza — kilka wymaga uzupełnienia.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await startCheckoutFn({
        data: {
          ...values,
          items: snapshot.map((it) => ({
            seller_id: it.seller_id,
            name: it.name,
            price_grosze: it.price_grosze,
            quantity: it.quantity,
            image: it.image ?? null,
          })),
        },
      });
      window.location.href = result.url;
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Nie udało się rozpocząć płatności. Spróbuj ponownie za chwilę.",
      );
      setSubmitting(false);
    }
  };

  if (snapshot === null) {
    return (
      <LegalShell title="Finalizacja zamówienia">
        <p className="contactLead">Ładuję Twój koszyk…</p>
      </LegalShell>
    );
  }

  if (snapshot.length === 0) {
    return (
      <LegalShell title="Finalizacja zamówienia">
        <p className="contactLead">
          Twój koszyk jest pusty. Wróć do{" "}
          <a href="/#kolekcja">kolekcji maskotek</a> i dodaj coś ciepłego do koszyka.
        </p>
      </LegalShell>
    );
  }

  return (
    <LegalShell title="Finalizacja zamówienia">
      <p className="contactLead">
        Podaj dane do wysyłki. Płatność obsługuje Stripe (tryb testowy) —
        Twoje dane karty nie trafiają na serwery Pufkuj.
      </p>

      <form className="customForm" onSubmit={handleSubmit} noValidate>
        <fieldset className="customForm__group">
          <legend>Dane kontaktowe</legend>
          <div className="customForm__grid">
            <label className="customForm__field customForm__field--wide">
              Imię i nazwisko
              <input
                type="text"
                value={values.customerName}
                onChange={update("customerName")}
                autoComplete="name"
                aria-invalid={errors.customerName ? true : undefined}
                required
                maxLength={120}
              />
              {errors.customerName && (
                <p className="customForm__error">{errors.customerName}</p>
              )}
            </label>
            <label className="customForm__field">
              E-mail
              <input
                type="email"
                value={values.customerEmail}
                onChange={update("customerEmail")}
                autoComplete="email"
                aria-invalid={errors.customerEmail ? true : undefined}
                required
                maxLength={200}
              />
              {errors.customerEmail && (
                <p className="customForm__error">{errors.customerEmail}</p>
              )}
            </label>
            <label className="customForm__field">
              Telefon
              <input
                type="tel"
                value={values.customerPhone}
                onChange={update("customerPhone")}
                autoComplete="tel"
                aria-invalid={errors.customerPhone ? true : undefined}
                required
                maxLength={30}
                placeholder="+48 500 600 700"
              />
              {errors.customerPhone && (
                <p className="customForm__error">{errors.customerPhone}</p>
              )}
            </label>
          </div>
        </fieldset>

        <fieldset className="customForm__group">
          <legend>Adres dostawy</legend>
          <div className="customForm__grid">
            <label className="customForm__field customForm__field--wide">
              Ulica i numer
              <input
                type="text"
                value={values.street}
                onChange={update("street")}
                autoComplete="street-address"
                aria-invalid={errors.street ? true : undefined}
                required
                maxLength={200}
              />
              {errors.street && <p className="customForm__error">{errors.street}</p>}
            </label>
            <label className="customForm__field">
              Kod pocztowy
              <input
                type="text"
                value={values.postalCode}
                onChange={update("postalCode")}
                autoComplete="postal-code"
                aria-invalid={errors.postalCode ? true : undefined}
                required
                maxLength={10}
                placeholder="00-000"
              />
              {errors.postalCode && (
                <p className="customForm__error">{errors.postalCode}</p>
              )}
            </label>
            <label className="customForm__field">
              Miasto
              <input
                type="text"
                value={values.city}
                onChange={update("city")}
                autoComplete="address-level2"
                aria-invalid={errors.city ? true : undefined}
                required
                maxLength={120}
              />
              {errors.city && <p className="customForm__error">{errors.city}</p>}
            </label>
          </div>
        </fieldset>

        <fieldset className="customForm__group">
          <legend>Dostawa</legend>
          <label className="customForm__check">
            <input type="radio" checked readOnly name="shipping" />
            <span>
              <strong>{SHIPPING_LABEL}</strong> — {formatPln(SHIPPING_GROSZE)}{" "}
              <span className="customForm__hint" style={{ display: "inline" }}>
                (jedyna dostępna metoda na tym etapie)
              </span>
            </span>
          </label>
        </fieldset>

        <section className="customForm__summary" aria-label="Podsumowanie zamówienia">
          <div>
            <span className="customForm__summaryLabel">Do zapłaty</span>
            <strong className="customForm__price">{formatPln(total)}</strong>
            <p className="customForm__note">
              {snapshot.reduce((sum, it) => sum + it.quantity, 0)} szt. · maskotki{" "}
              {formatPln(itemsTotal)} + dostawa {formatPln(SHIPPING_GROSZE)}
            </p>
          </div>
          <div className="customForm__actions">
            <button
              type="button"
              className="orderCta orderCta--ghost"
              onClick={() => navigate({ to: "/", hash: "kolekcja" })}
              disabled={submitting}
            >
              ← Wróć do sklepu
            </button>
            <button type="submit" className="orderCta" disabled={submitting}>
              {submitting ? "Przekierowuję…" : "Zapłać w Stripe"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      </form>

      <Toaster position="top-center" richColors />
    </LegalShell>
  );
}
