# Plan: Branding koszyka 1koszyk + audyt linków checkout

## Cel
Wyjaśnić użytkownikowi, dlaczego strona koszyka 1koszyk wygląda inaczej niż sklep Pufki, przygotować instrukcję dostosowania wyglądu w panelu 1koszyk oraz zweryfikować poprawność linków checkout w kodzie makiety Lovable.

## Wyjaśnienie wstępne
Strona koszyka pod adresem `https://pufka.1ct.eu/cart/...` to zewnętrzny serwis 1koszyk. Sklep Pufki (makieta Lovable) nie renderuje tej strony — przekazuje do niej użytkownika przez pole `short_code_uri` z API 1koszyk. Dlatego wygląd koszyka różni się od sklepu, dopóki nie zostanie skonfigurowany w panelu sprzedawcy 1koszyk.

## Zadania do wykonania

### 1. Przygotowanie poradnika brandingu 1koszyk
Utworzyć plik `docs/1koszyk-branding.md` zawierający instrukcję krok po kroku:
- **Logowanie do panelu 1koszyk** — gdzie znaleźć ustawienia wyglądu koszyka.
- **Kolory** — konkretne wartości z makiety Pufki:
  - tło / paper: `#fff9f0`
  - akcent / violet: `#b88ab8`
  - akcent / coral: `#d79b9f`
  - tekst / ink: `#343137`
- **Czcionki** — jak ustawić:
  - Display / nagłówki: `Fredoka`
  - Body / tekst: `Nunito`
  - Sugestia wklejenia linków Google Fonts lub self-hosted assets.
- **Logo i grafiki** — wymagane pliki, formaty, rozmiary i gdzie je wgrać w panelu 1koszyk.
- **Ustawienia panelu** — lista pól do zmiany (np. nazwa sklepu, adres e-mail kontaktowy, kolory przycisków, tło, favicon, stopka).
- **Adres kontaktowy** — upewnić się, że w panelu 1koszyk widnieje `kontakt@pufkuj.pl` i domena `pufkuj.pl`.

### 2. Audyt linków checkout w kodzie makiety
Sprawdzić dwa pliki:
- `src/lib/onecart.functions.ts` — czy typ `Product` poprawnie zawiera `short_code_uri`, czy normalizacja ceny nie wpływa na URL.
- `src/components/storefront.tsx` — czy przyciski "Kup" oraz "Przejdź do zakupu" używają `product.short_code_uri` i czy `target="_blank"` jest poprawnie wyłączany w trybie demo.

### 3. Ewentualne poprawki kodu (tylko jeśli audyt wykaże błąd)
- Dodać walidację, że `short_code_uri` zaczyna się od `https://` (lub odpowiedniej domeny 1koszyk).
- Dodać fallback do `#kontakt` lub bezpośredniego URL-a koszyka, jeśli API zwróci pusty/nieprawidłowy `short_code_uri`.
- Upewnić się, że w trybie demo linki nie otwierają się w nowej karcie (już obecne, do weryfikacji).

### 4. Weryfikacja buildu
Uruchomić:
- `tsgo --noEmit`
- `bun run build`

Zakładamy, że poradnik trafi do projektu jako plik markdown. Jeśli użytkownik woli odpowiedź wyłącznie w czacie, zadanie 1 zostanie zrealizowane jako odpowiedź zamiast pliku.