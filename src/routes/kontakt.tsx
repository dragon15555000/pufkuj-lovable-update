import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – Pufkuj" },
      {
        name: "description",
        content:
          "Skontaktuj się z Pufkuj – odpowiemy na pytania dotyczące ręcznie szydełkowanych maskotek i zamówień.",
      },
      { property: "og:title", content: "Kontakt – Pufkuj" },
      {
        property: "og:description",
        content:
          "Skontaktuj się z Pufkuj – odpowiemy na pytania dotyczące ręcznie szydełkowanych maskotek i zamówień.",
      },
      { property: "og:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pufkuj",
          image: "https://pufki-shop-magic.lovable.app/og-image.png",
          email: "kontakt@pufkuj.pl",
          url: "https://pufki-shop-magic.lovable.app/kontakt",
          address: {
            "@type": "PostalAddress",
            streetAddress: "ul. Borowskiego 7b/7",
            postalCode: "66-400",
            addressLocality: "Gorzów Wielkopolski",
            addressCountry: "PL",
          },
          sameAs: ["https://www.instagram.com/pufkuj.pl/"],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalShell title="Skontaktuj się z nami">
      <p className="contactLead">
        Masz pytanie o maskotkę, chcesz zamówić własny wzór albo zgłosić reklamację? Napisz —
        odpowiadamy zwykle w ciągu 24 godzin.
      </p>
      <section className="contactCard">
        <div>
          <p className="eyebrow">E-mail</p>
          <a href="mailto:kontakt@pufkuj.pl">kontakt@pufkuj.pl</a>
        </div>
        <div>
          <p className="eyebrow">Instagram</p>
          <a href="https://www.instagram.com/pufkuj.pl/" target="_blank" rel="noreferrer">
            @pufkuj.pl ↗
          </a>
        </div>
        <div>
          <p className="eyebrow">Adres korespondencyjny</p>
          <address>
            ul. Borowskiego 7b/7
            <br />
            66-400 Gorzów Wielkopolski
          </address>
        </div>
      </section>
      <p className="documentHint">
        Bezpieczny formularz zostanie uruchomiony po podłączeniu usługi wysyłkowej. Do tego czasu
        e-mail jest w pełni działającym kanałem kontaktu.
      </p>
    </LegalShell>
  );
}
