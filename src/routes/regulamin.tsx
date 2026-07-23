import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

export const Route = createFileRoute("/regulamin")({
  head: () => ({
    meta: [
      { title: "Regulamin – Pufkuj" },
      {
        name: "description",
        content: "Regulamin sklepu Pufkuj – zasady zakupów, dostawy i zwrotów.",
      },
      { property: "og:title", content: "Regulamin – Pufkuj" },
      {
        property: "og:description",
        content: "Regulamin sklepu Pufkuj – zasady zakupów, dostawy i zwrotów.",
      },
      { property: "og:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://pufki-shop-magic.lovable.app/og-image.png" },
    ],
  }),
  component: RegulaminPage,
});

function RegulaminPage() {
  return (
    <LegalShell title="Regulamin Sklepu Internetowego Pufkuj">
      <section>
        <h2>1. Postanowienia ogólne</h2>
        <p>Sklep internetowy pod adresem pufkuj.pl prowadzony jest przez:</p>
        <p>
          Bartosz Gallos
          <br />
          ul. Borowskiego 7b/7
          <br />
          66-400 Gorzów Wielkopolski
          <br />
          E-mail: kontakt@pufkuj.pl
        </p>
        <p>
          Sklep działa w ramach tzw. działalności nierejestrowanej na podstawie art. 5 ustawy z dnia 6 marca 2018 r. - Prawo przedsiębiorców.
          Działalność jest w pełni legalna, a każdy kupujący ma pełne prawa konsumenckie. Po dokonaniu zakupu otrzymasz e-mail, który stanowi dowód zakupu (rachunek).
        </p>
        <p>
          Regulamin określa zasady składania zamówień, realizacji dostaw, płatności oraz
          odstąpienia od umowy w Sklepie. Każdy Klient zobowiązany jest do zapoznania się z jego
          treścią przed złożeniem zamówienia.
        </p>
      </section>
      <section>
        <h2>2. Zamówienia</h2>
        <p>
          Zamówienia składane są za pośrednictwem strony pufkuj.pl poprzez system koszyka.
          Klient może wybrać produkt gotowy albo uzgodnić produkt wykonywany indywidualnie.
        </p>
        <p>
          Termin realizacji, wymiary, kolory oraz pozostałe parametry produktu indywidualnego są
          ustalane z Klientem przed złożeniem zamówienia.
        </p>
      </section>
      <section>
        <h2>3. Ceny i płatności</h2>
        <p>
          Ceny na stronie są cenami brutto (zawierają podatek VAT, o ile ma zastosowanie).
          Płatności realizowane są bezpośrednio w Sklepie za pośrednictwem operatora
          Stripe (Stripe Payments Europe, Ltd.). Dostępne metody obejmują karty płatnicze
          oraz BLIK. Dane karty nie są przechowywane przez Sprzedawcę — są przekazywane
          bezpośrednio do Stripe.
        </p>
        <p>Płatności należy dokonać w terminie wskazanym podczas składania zamówienia.</p>
      </section>
      <section>
        <h2>4. Dostawa</h2>
        <ul>
          <li>Kurier — 18 zł.</li>
          <li>Paczkomat InPost — 15 zł (tymczasowo niedostępny, wróci w kolejnej fazie).</li>
          <li>
            Odbiór osobisty: ul. Borowskiego 7b/7, 66-400 Gorzów Wielkopolski, po wcześniejszym
            uzgodnieniu.
          </li>
        </ul>
        <p>
          Produkty gotowe wysyłane są w ciągu 2 dni roboczych od zaksięgowania płatności. Termin
          realizacji produktów indywidualnych jest ustalany z Klientem.
        </p>
      </section>
      <section>
        <h2>5. Odstąpienie od umowy</h2>
        <p>
          Konsument może odstąpić od umowy w ciągu 14 dni od otrzymania produktu, bez podawania
          przyczyny. Produkt należy odesłać na własny koszt na adres sprzedawcy.
        </p>
        <p>
          Produkty wykonane według indywidualnych parametrów Klienta nie podlegają zwrotowi
          zgodnie z art. 38 pkt 3 ustawy o prawach konsumenta.
        </p>
      </section>
      <section>
        <h2>6. Reklamacje</h2>
        <p>
          Reklamacje należy przesłać na kontakt@pufkuj.pl lub adres sprzedawcy. Zgłoszenie
          powinno zawierać opis wady, numer zamówienia lub dowód zakupu oraz, jeśli dotyczy,
          zdjęcie uszkodzenia.
        </p>
        <p>Sprzedawca odpowie na reklamację w terminie 14 dni od jej otrzymania.</p>
      </section>
      <section>
        <h2>7. Postanowienia końcowe</h2>
        <p>
          Regulamin obowiązuje od dnia publikacji. Zmiany nie wpływają na zamówienia złożone
          wcześniej. W sprawach nieuregulowanych stosuje się Kodeks cywilny i ustawę o prawach
          konsumenta.
        </p>
      </section>
    </LegalShell>
  );
}
