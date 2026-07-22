import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności – Pufkuj" },
      {
        name: "description",
        content: "Informacje o ochronie danych osobowych w sklepie Pufkuj.",
      },
      { property: "og:title", content: "Polityka prywatności – Pufkuj" },
      {
        property: "og:description",
        content: "Informacje o ochronie danych osobowych w sklepie Pufkuj.",
      },
      { property: "og:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Polityka prywatności Sklepu Pufkuj">
      <section>
        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych jest Bartosz Gallos, wykonujący działalność nierejestrowaną, ul.
          Borowskiego 7b/7, 66-400 Gorzów Wielkopolski, e-mail: kontakt@pufkuj.pl.
        </p>
      </section>
      <section>
        <h2>2. Zakres i cele</h2>
        <p>
          W celu realizacji zamówień przetwarzane mogą być: imię i nazwisko, adres dostawy, e-mail
          oraz opcjonalnie telefon. Dane służą realizacji zamówienia, kontaktowi i wystawieniu
          dowodu zakupu.
        </p>
      </section>
      <section>
        <h2>3. Podstawa prawna</h2>
        <ul>
          <li>art. 6 ust. 1 lit. b RODO — realizacja umowy,</li>
          <li>
            art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes, w tym dochodzenie roszczeń,
          </li>
          <li>art. 6 ust. 1 lit. a RODO — zgoda, jeśli zostanie udzielona.</li>
        </ul>
      </section>
      <section>
        <h2>4. Odbiorcy danych</h2>
        <p>
          Dane mogą otrzymać podmioty niezbędne do realizacji zamówienia:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> (Stripe Payments Europe, Ltd.) — operator płatności. Dane
            karty płatniczej nie są przechowywane przez Sprzedawcę i są przekazywane
            bezpośrednio do Stripe w celu obsługi transakcji.
          </li>
          <li>
            <strong>Lovable Cloud / Supabase</strong> — dostawca infrastruktury bazodanowej
            (hosting bazy zamówień i danych kontaktowych Klienta) na zasadzie podmiotu
            przetwarzającego dane w imieniu Administratora.
          </li>
          <li>
            <strong>InPost oraz operatorzy kurierscy</strong> — w celu realizacji dostawy
            zamówionego produktu.
          </li>
        </ul>
      </section>
      <section>
        <h2>5. Okres przechowywania</h2>
        <p>
          Dane są przechowywane przez czas realizacji zamówienia, a następnie przez okres
          wymagany prawem, w szczególności podatkowym — do 5 lat od końca roku transakcji.
        </p>
      </section>
      <section>
        <h2>6. Prawa Klienta</h2>
        <p>
          Klient może żądać dostępu, sprostowania, usunięcia, ograniczenia przetwarzania i
          przeniesienia danych, wnieść sprzeciw oraz cofnąć zgodę. Kontakt: kontakt@pufkuj.pl.
        </p>
      </section>
      <section>
        <h2>7. Pliki cookies</h2>
        <p>
          Sklep korzysta z cookies niezbędnych do działania koszyka. Analityczne cookies będą
          używane tylko po wdrożeniu odpowiedniego narzędzia i zgodnie z wymaganiami dotyczącymi
          zgody. Cookies można kontrolować w ustawieniach przeglądarki.
        </p>
      </section>
      <section>
        <h2>8. Skargi</h2>
        <p>
          Osoba, której dane dotyczą, może wnieść skargę do Prezesa Urzędu Ochrony Danych
          Osobowych.
        </p>
      </section>
    </LegalShell>
  );
}
