import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="legalPage">
      <header className="legalNav shell">
        <Link className="brand" to="/">
          pufkuj<span>♥</span>
        </Link>
        <Link to="/">← Wróć do sklepu</Link>
      </header>
      <article className="legalDocument shell">
        <p className="eyebrow">Pufkuj · informacje dla kupujących</p>
        <h1>{title}</h1>
        {children}
      </article>
      <footer className="legalFooter shell">
        <nav aria-label="Dokumenty prawne">
          <Link to="/regulamin">Regulamin</Link>
          <Link to="/polityka-prywatnosci">Polityka prywatności</Link>
          <Link to="/odstapienie">Odstąpienie od umowy</Link>
          <Link to="/kontakt">Kontakt</Link>
        </nav>
        <p>
          Sklep internetowy Pufkuj · Bartosz Gallos · ul. Borowskiego 7b/7, 66-400 Gorzów
          Wielkopolski
        </p>
      </footer>
    </main>
  );
}
