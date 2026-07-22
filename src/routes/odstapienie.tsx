import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/odstapienie")({
  head: () => ({
    meta: [
      { title: "Odstąpienie od umowy – Pufkuj" },
      {
        name: "description",
        content: "Informacje o prawie odstąpienia od umowy i zwrotach w sklepie Pufkuj.",
      },
      { property: "og:title", content: "Odstąpienie od umowy – Pufkuj" },
      {
        property: "og:description",
        content: "Informacje o prawie odstąpienia od umowy i zwrotach w sklepie Pufkuj.",
      },
      { property: "og:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
    ],
  }),
  component: WithdrawalPage,
});

function WithdrawalPage() {
  return (
    <LegalShell title="Wzór odstąpienia od umowy">
      <p className="documentHint">
        Formularz można wydrukować, wypełnić i przesłać na kontakt@pufkuj.pl albo adres
        sprzedawcy.
      </p>
      <section>
        <h2>Adresat</h2>
        <address>
          Bartosz Gallos
          <br />
          ul. Borowskiego 7b/7
          <br />
          66-400 Gorzów Wielkopolski
          <br />
          kontakt@pufkuj.pl
        </address>
      </section>
      <section className="formTemplate">
        <p>
          Ja, niżej podpisany(-a), informuję o odstąpieniu od umowy sprzedaży następujących
          produktów:
        </p>
        <div className="writingLine">Nazwa produktu i ilość</div>
        <div className="writingLine">Data zawarcia umowy</div>
        <div className="writingLine">Data otrzymania produktu</div>
        <div className="writingLine">Imię i nazwisko Klienta</div>
        <div className="writingLine">Adres Klienta</div>
        <div className="writingLine">Adres e-mail</div>
        <div className="writingLine">Numer zamówienia</div>
        <div className="writingLine">Numer rachunku do zwrotu</div>
        <div className="writingLine">Data i podpis</div>
      </section>
      <section>
        <h2>Informacja dla Klienta</h2>
        <ul>
          <li>Termin na odstąpienie wynosi 14 dni od otrzymania produktu.</li>
          <li>Produkt należy odesłać na adres sprzedawcy.</li>
          <li>Koszt zwrotu ponosi Klient.</li>
          <li>Produkty wykonane według indywidualnych parametrów nie podlegają zwrotowi.</li>
        </ul>
      </section>
    </LegalShell>
  );
}
