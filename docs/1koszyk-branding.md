# Dostosowanie wyglądu koszyka 1koszyk do brandingu Pufki

## 🚨 Problemy zdiagnozowane na produkcyjnej stronie koszyka

Zrzut ekranu z `https://pufka.1ct.eu/cart/?product=p4` ujawnił trzy blokery, które trzeba naprawić **w panelu 1koszyk** (kod sklepu nie ma tu wpływu):

| # | Problem | Gdzie naprawić | Priorytet |
|---|---------|----------------|-----------|
| 1 | Komunikat blokujący: *„Ze względu na konfigurację sprzedawcy nie jest możliwe kontynuowanie zamówienia na wybrane produkty"* — brak skonfigurowanych metod płatności i/lub dostawy | Panel 1koszyk → **Płatności** i **Dostawy** | 🔴 KRYTYCZNY (zakup niemożliwy) |
| 2 | Nazwy produktów wyświetlane jako surowe kody `p3`, `p4` zamiast przyjaznych nazw (np. „Axolotl różowy") | Panel 1koszyk → **Produkty** → pole *Nazwa* | 🟠 WYSOKI (odbiór klienta) |
| 3 | Domyślny branding 1koszyk (ciemnozielony nagłówek „KOSZYK", niebieski geometryczny sidebar), brak logo Pufki, standardowe czcionki | Panel 1koszyk → **Personalizacja / Wygląd** (sekcje 2–5 poniżej) | 🟡 ŚREDNI (spójność wizualna) |

> **Ważne:** wszystkie trzy problemy leżą po stronie konfiguracji panelu 1koszyk. Kod sklepu Pufki (`src/lib/onecart.functions.ts`, `src/components/storefront.tsx`) jest poprawny — pobiera i renderuje `short_code_uri` oraz nazwy tak, jak zwraca je API 1koszyk.

---

## Dlaczego strona koszyka wygląda inaczej niż sklep?

Strona koszyka pod adresem `https://pufka.1ct.eu/cart/?product=...` to **zewnętrzny serwis 1koszyk**. Sklep Pufki (makieta Lovable / produkcyjny Next.js) nie renderuje tej strony samodzielnie — przekierowuje do niej użytkownika za pomocą pola `short_code_uri` z API 1koszyk.

Dlatego wygląd koszyka różni się od sklepu Pufki, dopóki nie zostanie ręcznie skonfigurowany w panelu sprzedawcy 1koszyk.

> Dobre wieści: 1koszyk pozwala dostosować kolory, czcionki, logo i stopkę koszyka, więc można go wizualnie dopasować do Pufki.

---


## 1. Logowanie do panelu 1koszyk

1. Wejdź na [https://1koszyk.pl](https://1koszyk.pl) i zaloguj się na konto sprzedawcy.
2. Przejdź do sekcji **Ustawienia** (lub **Wygląd koszyka** / **Personalizacja** — nazwa zależy od wersji panelu).
3. Znajdź zakładkę odpowiedzialną za **wygląd koszyka / strony płatności**.

---

## 2. Kolory — użyj zmiennych Pufki

W panelu 1koszyk ustaw poniższe kolory. Są to oficjalne kolory brandingu Pufki ze sklepu:

| Element | Kolor | Użycie |
|---------|-------|--------|
| Tło strony | `#fff9f0` | główne tło koszyka (papierowy, ciepły krem) |
| Kolor akcentu 1 | `#b88ab8` | przyciski główne, linki, nagłówki (lawendowy/fiołkowy) |
| Kolor akcentu 2 | `#d79b9f` | akcenty, badge'e, hover (koralowy/różowy) |
| Kolor tekstu | `#343137` | główny tekst (ciemny, ciepły grafit) |
| Tło kart / boksów | `#ffffff` | tło pól formularza i podsumowania |
| Kolor ramki / divider | `#e8dfd3` | subtelne rozdzielenie sekcji |

### Sugerowane mapowanie w panelu 1koszyk

- **Primary color / Kolor główny**: `#b88ab8`
- **Secondary color / Kolor dodatkowy**: `#d79b9f`
- **Background color / Tło**: `#fff9f0`
- **Text color / Kolor tekstu**: `#343137`
- **Button background / Tło przycisku**: `#b88ab8`
- **Button text / Tekst przycisku**: `#ffffff`
- **Button hover background / Tło przycisku po najechaniu**: `#d79b9f`
- **Link color / Kolor linków**: `#b88ab8`

---

## 3. Czcionki — Fredoka i Nunito

Sklep Pufki używa dwóch czcionek z Google Fonts:

- **Fredoka** — nagłówki, logo, duży tekst (display font)
- **Nunito** — tekst podstawowy, opisy, formularze (body font)

### Jak ustawić w panelu 1koszyk

1. Wejdź na [Google Fonts](https://fonts.google.com/).
2. Znajdź i dodaj do projektu czcionki:
   - `Fredoka` (wagi: 400, 500, 600)
   - `Nunito` (wagi: 400, 600, 700)
3. Skopiuj wygenerowany link `<link href="..." rel="stylesheet">` lub `@import`.
4. W panelu 1koszyk wklej link do czcionek w polu **Custom CSS / Własne czcionki** (jeśli panel to obsługuje).
5. Ustaw:
   - **Font family (headings)**: `Fredoka, sans-serif`
   - **Font family (body)**: `Nunito, sans-serif`

Jeśli panel 1koszyk nie pozwala na własne czcionki, wybierz najbliższe dostępne:
- zamiast Fredoki: zaokrągloną, przyjazną czcionkę bezszeryfową (np. `Quicksand`, `Varela Round`)
- zamiast Nunito: czytelną czcionkę bezszeryfową (np. `Open Sans`, `Lato`)

---

## 4. Logo i grafiki

### Logo

Wgraj logo Pufki w panelu 1koszyk:

- **Plik**: `public/logo-pufki.svg` lub `public/pufki-logo.png` (jeśli istnieje w projekcie)
- **Format**: SVG (najlepiej) lub PNG z przezroczystym tłem
- **Szerokość**: ok. 140–180 px na desktopie
- **Tło**: przezroczyste lub kolor `#fff9f0`

Jeśli nie masz gotowego logo, użyj tekstowego logotypu **pufki♥** w kolorze `#b88ab8` lub `#343137`, czcionką Fredoka.

### Favicon

Ustaw favicon z głównego sklepu (np. `public/favicon.ico` lub `public/favicon.svg`).

### Grafiki dodatkowe (opcjonalnie)

Jeśli panel 1koszyk pozwala na własne grafiki:
- dodaj małą ilustrację pluszaka w stopce lub pustym stanie koszyka
- użyj kolorów `#b88ab8` i `#d79b9f` jako akcentów

---

## 5. Ustawienia panelu 1koszyk do zmiany

Przejdź przez poniższą listę w panelu 1koszyk i dostosuj:

| Sekcja | Co zmienić | Wartość |
|--------|-----------|---------|
| Nazwa sklepu | Wyświetlana nazwa | `Pufki` |
| Adres e-mail | Kontakt do klienta | `kontakt@pufkuj.pl` |
| Domena sklepu | Adres Twojej strony | `https://pufkuj.pl` |
| Logo sklepu | Wgraj logo Pufki | plik SVG/PNG |
| Kolory brandingu | Primary / Secondary / Background / Text | `#b88ab8`, `#d79b9f`, `#fff9f0`, `#343137` |
| Czcionki | Headings / Body | `Fredoka` / `Nunito` |
| Przycisk "Zapłać" / "Kup" | Kolor tła i tekstu | tło `#b88ab8`, tekst `#ffffff` |
| Stopka koszyka | Tekst stopki | `© {rok} Bartosz Gallos · Wszelkie prawa zastrzeżone` |
| Puste stany | Tekst pustego koszyka | np. "Koszyk jest pusty. Wróć do sklepu Pufki i wybierz maskotkę." |

---

## 6. Weryfikacja linku do koszyka w kodzie

W kodzie sklepu link do koszyka 1koszyk jest pobierany z API jako pole `short_code_uri`.

### Gdzie w kodzie znajduje się link

- `src/lib/onecart.functions.ts` — typ `Product` zawiera pole `short_code_uri: string`
- `src/components/storefront.tsx` — przyciski "Kup" i "Przejdź do zakupu" używają `product.short_code_uri`

### Czy link jest poprawny?

Tak, pod warunkiem że API 1koszyk zwraca pełny URL koszyka, np.:

```
https://pufka.1ct.eu/cart/?product=p4
```

Warto zwrócić uwagę na kilka rzeczy:

1. **W trybie demo** (brak `ONECART_API_KEY` / `ONECART_CLIENT_ID`) `short_code_uri` ma wartość `#kontakt` — wtedy przycisk przewija do sekcji kontaktu zamiast otwierać 1koszyk.
2. **W produkcji** `short_code_uri` powinno zawierać pełen URL z domeny `1ct.eu`.
3. **Każdy produkt kupuje się osobno** — koszyk Pufki zbiera produkty, ale 1koszyk obsługuje je jako osobne transakcje. Dlatego główny przycisk "Przejdź do zakupu" prowadzi do pierwszej pozycji z koszyka.

### Jak sprawdzić, czy API zwraca dobry link

1. Zaloguj się do panelu 1koszyk.
2. Sprawdź w sekcji produktów, czy każdy produkt ma wygenerowany **krótki link / short code**.
3. Kliknij w link testowy — powinien prowadzić do `https://pufka.1ct.eu/cart/?product=...`.
4. Jeśli link prowadzi gdzie indziej, skontaktuj się z supportem 1koszyk lub wygeneruj short code ponownie.

---

## 7. Checklista dostosowania koszyka 1koszyk

### 🔴 KRYTYCZNE — bez tego zakup jest zablokowany
- [ ] **Płatności**: skonfigurowano co najmniej jedną metodę (BLIK / przelew / karta / Przelewy24 / PayU — cokolwiek dostępne w panelu)
- [ ] **Dostawy**: skonfigurowano co najmniej jedną metodę (Paczkomat / kurier / odbiór osobisty)
- [ ] Wykonano zakup testowy end-to-end (kliknięcie w sklepie → finalizacja → potwierdzenie) — komunikat *„Ze względu na konfigurację sprzedawcy…"* nie pojawia się

### 🟠 WYSOKIE — dane produktów
- [ ] Każdy produkt (`p1`, `p2`, `p3`, `p4`, …) ma uzupełnione pole **Nazwa** przyjazną nazwą (np. „Axolotl różowy", „Ośmiorniczka koralowa", „Żółwik miętowy")
- [ ] Każdy produkt ma **krótki opis** zgodny ze sklepem
- [ ] Każdy produkt ma **zdjęcie** (najlepiej to samo co w `/products/examples/` w repo sklepu)
- [ ] Ceny w panelu są zgodne z cenami w sklepie (jednostka: grosze — patrz `price_amount` w kodzie)
- [ ] Ustawiono `quantity_limit` tam, gdzie produkt jest sztuką unikatową (gotowa do wysyłki)

### 🟡 ŚREDNIE — branding
- [ ] Zalogowano się do panelu sprzedawcy 1koszyk
- [ ] Ustawiono kolory: tło `#fff9f0`, primary `#b88ab8`, secondary `#d79b9f`, tekst `#343137`
- [ ] Nagłówek „KOSZYK" ma kolor `#b88ab8` zamiast domyślnego ciemnozielonego
- [ ] Sidebar / panel boczny ma tło `#fff9f0` zamiast domyślnego niebieskiego geometrycznego wzoru
- [ ] Dodano czcionki Fredoka (headings) i Nunito (body)
- [ ] Wgrano logo Pufki (SVG/PNG, przezroczyste tło)
- [ ] Ustawiono nazwę sklepu `Pufki`
- [ ] Ustawiono e-mail `kontakt@pufkuj.pl`
- [ ] Ustawiono domenę `https://pufkuj.pl`
- [ ] Zweryfikowano, że short code produktów prowadzi do `https://pufka.1ct.eu/cart/?product=...`

### 🟢 OPCJONALNE — embed widget zamiast redirectu
- [ ] Ustawiono `VITE_ONECART_EMBED_SRC=https://pufka.1ct.eu/assets/front/embeded.bundle.js` (domyślny adres na darmowym planie 1koszyk)
- [ ] Zweryfikowano, że pływający panel koszyka otwiera się po kliknięciu „Dodaj do koszyka"
- [ ] (Przyszłość) Po migracji na własną domenę: `VITE_ONECART_EMBED_SRC=https://koszyk.pufkuj.pl/assets/front/embeded.bundle.js`

---

## 8. Migracja na własną domenę koszyk.pufkuj.pl

> **Uwaga:** ta sekcja opisuje przyszłą opcję. Obecnie Pufki używają darmowego planu 1koszyk, więc koszyk działa pod domyślną domeną `pufka.1ct.eu`. Własna domena `koszyk.pufkuj.pl` wymaga odpowiedniego planu/subskrypcji 1koszyk oraz ręcznej konfiguracji DNS i Cloudflare Turnstile. Nie wdrażaj tej zmiany, dopóki panel 1koszyk nie udostępni Ci opcji dodania własnej domeny.

Docelowo widget koszyka (oraz strona koszyka) mają działać pod własną subdomeną `koszyk.pufkuj.pl` zamiast domyślnej `pufka.1ct.eu`. Poniższa checklista opisuje kroki wymagane **poza kodem sklepu** — samej zmiany zmiennej środowiskowej dokonuje się dopiero po zakończeniu konfiguracji.

### Checklista migracji

- [ ] **DNS** — u rejestratora domeny `pufkuj.pl` dodaj rekord CNAME:
  - **Nazwa / Host:** `koszyk`
  - **Wartość / Target:** `1ct.eu`
  - **TTL:** `3600`
  - Po zapisaniu czekaj na propagację DNS (zazwyczaj do 24h, często szybciej).
- [ ] **Panel 1koszyk** — przejdź do **Konfiguracja → Integracje → zakładka "Domeny"**:
  - Dodaj przedrostek `koszyk`.
  - Opcjonalnie ustaw `koszyk.pufkuj.pl` jako domenę domyślną dla koszyka.
- [ ] **Cloudflare Turnstile** — własna domena sprzedawcy wymaga zainstalowania widgetu Turnstile:
  1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com) → **Application security → Turnstile**.
  2. Kliknij **Add Hostnames** i dodaj hostname `koszyk.pufkuj.pl`.
  3. Utwórz widget (**Create**), a następnie skopiuj **Site Key** i **Secret Key**.
  4. Wklej oba klucze w panelu 1koszyk: **Konfiguracja → Integracje → zakładka "Usługi"** (sekcja Cloudflare Turnstile).
  5. Szczegółową instrukcję znajdziesz w dokumentacji 1koszyk: [Cloudflare Turnstile — instalacja widgetu dla własnej domeny sprzedawcy](https://wiki.1cart.eu/books/1koszyk-faq/page/cloudflare-turnstile-instalacja-widgetu-dla-wlasnej-domeny-sprzedawcy).
- [ ] **Weryfikacja** — po propagacji DNS i aktywacji domeny w panelu 1koszyk otwórz w przeglądarce:
  ```
  https://koszyk.pufkuj.pl/cart/?product=p4
  ```
  Strona powinna załadować się bez błędów certyfikatu i bez komunikatu o braku konfiguracji domeny.
- [ ] **Aktualizacja zmiennej środowiskowej** — dopiero po powyższych krokach ustaw w środowisku produkcyjnym:
  ```
  VITE_ONECART_EMBED_SRC=https://koszyk.pufkuj.pl/assets/front/embeded.bundle.js
  ```
  Do czasu zakończenia migracji jako fallback można użyć:
  ```
  VITE_ONECART_EMBED_SRC=https://pufka.1ct.eu/assets/front/embeded.bundle.js
  ```

---

## 9. Embed widget zamiast przekierowania (opcjonalnie)

Zamiast przekierowywać klienta na `pufka.1ct.eu/cart/`, można osadzić **pływający widget koszyka** bezpośrednio w sklepie Pufki. Widget wygląda jak pigułka w prawym dolnym rogu, rozwija się w panel 350 px i pozwala sfinalizować zamówienie bez opuszczania strony.

**Jak działa** (na podstawie analizy `embeded.bundle.js`):
- osadza `<iframe>` `#cart1-frame` w rogu strony (54 px zwinięty, 350 px rozwinięty, 100 % szerokości na mobile)
- używa cookie `__1cart_cart_id` do trzymania koszyka między odsłonami
- udostępnia globalne API: `window.oneCart.addProduct(shortCodeUri)` i `window.oneCart.showWidget()`
- automatycznie przechwytuje kliknięcia w `<a href="…1ct.eu/…">` i dodaje produkt do widgetu

**Wdrożenie (status: aktywne w makiecie Lovable, zgodne z produkcyjnym PR #18)**:

1. `src/routes/__root.tsx` wstrzykuje `<script id="onecart" src={VITE_ONECART_EMBED_SRC} async>` gdy zmienna env jest ustawiona.
2. W `src/components/storefront.tsx` przycisk „Przejdź do zakupu" w koszyku wywołuje potwierdzone globalne API widgetu:

   ```ts
   if (window.oneCart) {
     for (const item of cartItems) {
       window.oneCart.addProduct(item.product.short_code_uri);
     }
     window.oneCart.showWidget();
   } else {
     window.open(cartItems[0].product.short_code_uri, "_blank");
   }
   ```

   Link pozostaje `<a href={short_code_uri}>` z `e.preventDefault()` wewnątrz `onClick` — dzięki temu bez JS/embeddu klient trafia bezpośrednio do koszyka 1koszyk (progresywne wzbogacanie, brak zmian CSS).
3. Typy globalne `window.oneCart` są zadeklarowane w `src/types/onecart-widget.d.ts` — wyłącznie `addProduct(shortCodeUri)` i `showWidget()` (potwierdzone przez analizę realnego `embeded.bundle.js`; żadnych zgadywanych metod ani atrybutów `data-*`).
4. W trybie demo (brak `VITE_ONECART_EMBED_SRC`) zostaje lokalny podgląd `src/components/onecart-widget-preview.tsx`.

---

## Podsumowanie

Strona koszyka 1koszyk nie jest zgodna z Pufkami z trzech powodów: (1) brakuje płatności/dostaw, przez co zamówienie jest blokowane, (2) produkty mają surowe kody `p3`/`p4` zamiast nazw, (3) używany jest domyślny szablon 1koszyk. Wszystkie trzy problemy naprawia się **w panelu 1koszyk** — kod sklepu (`short_code_uri`, `normalizePrice`, przyciski „Kup") jest poprawny i nie wymaga zmian.

