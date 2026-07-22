import { useState } from "react";
import type { Product } from "@/lib/onecart.functions";

/**
 * Wizualny podgląd tego, jak wygląda widget 1koszyk (embeded.bundle.js)
 * PO wgraniu brandingu Pufkuj w panelu 1koszyk. To makieta — nie osadza
 * prawdziwego iframe'u. W produkcji zastępuje ją <script id="onecart" src="...">.
 */
export function OneCartWidgetPreview({
  items,
}: {
  items: { product: Product; quantity: number }[];
}) {
  const [open, setOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce(
    (s, i) => s + (i.product.price_amount ?? 0) * i.quantity,
    0,
  );
  const checkoutHref = items[0]?.product.short_code_uri ?? "#kontakt";

  return (
    <div
      aria-label="Podgląd widgetu 1koszyk"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: open ? 350 : "auto",
        maxWidth: "calc(100vw - 40px)",
        zIndex: 60,
        fontFamily: "var(--font-body, Nunito), system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          right: 0,
          marginBottom: 8,
          fontSize: 11,
          background: "rgba(52,49,55,0.85)",
          color: "#fff9f0",
          padding: "3px 8px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          letterSpacing: 0.3,
        }}
      >
        Podgląd widgetu 1koszyk · branding Pufkuj
      </div>

      {open ? (
        <div
          style={{
            background: "#fff9f0",
            border: "1px solid rgba(184,138,184,0.35)",
            borderRadius: 20,
            boxShadow: "0 24px 60px -20px rgba(52,49,55,0.35)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "min(560px, 80vh)",
          }}
        >
          <header
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg,#b88ab8,#d79b9f)",
              color: "#fff9f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Fredoka, system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                Twój koszyk Pufkuj
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                {count === 0
                  ? "Jeszcze pusto"
                  : `${count} ${count === 1 ? "maskotka" : "maskotek"}`}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zwiń koszyk"
              style={{
                background: "rgba(255,249,240,0.2)",
                color: "#fff9f0",
                border: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </header>

          <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>
            {items.length === 0 ? (
              <p style={{ margin: 0, color: "#7a6f78", fontSize: 14 }}>
                Dodaj maskotkę z kolekcji, a pojawi się tutaj — dokładnie tak,
                jak w prawdziwym widgecie 1koszyk.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 12,
                }}
              >
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      background: "#fff",
                      border: "1px solid rgba(184,138,184,0.2)",
                      padding: 10,
                      borderRadius: 14,
                    }}
                  >
                    {product.image_thumbnail || product.image ? (
                      <img
                        src={product.image_thumbnail ?? product.image ?? ""}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: "#f4e3ee",
                          borderRadius: 10,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#343137",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#7a6f78" }}>
                        {quantity} × {product.price_formatted}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer
            style={{
              padding: 16,
              borderTop: "1px solid rgba(184,138,184,0.25)",
              background: "#fff",
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "#343137",
              }}
            >
              <span>Razem</span>
              <strong>
                {new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN",
                }).format(total / 100)}
              </strong>
            </div>
            <a
              href={checkoutHref}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "#b88ab8",
                color: "#fff9f0",
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                fontFamily: "Fredoka, system-ui, sans-serif",
                letterSpacing: 0.3,
                pointerEvents: items.length === 0 ? "none" : "auto",
                opacity: items.length === 0 ? 0.5 : 1,
              }}
            >
              Przejdź do zakupu
            </a>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#7a6f78",
                textAlign: "center",
              }}
            >
              Podgląd stylu — realny widget dodaje{" "}
              <code>embeded.bundle.js</code>.
            </p>
          </footer>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            height: 54,
            padding: "0 22px",
            borderRadius: 999,
            border: 0,
            cursor: "pointer",
            background: "linear-gradient(135deg,#b88ab8,#d79b9f)",
            color: "#fff9f0",
            fontFamily: "Fredoka, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            boxShadow: "0 16px 32px -12px rgba(184,138,184,0.6)",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 20 }}>
            🧶
          </span>
          Koszyk Pufkuj
          <span
            style={{
              background: "rgba(255,249,240,0.25)",
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 13,
              minWidth: 26,
              textAlign: "center",
            }}
          >
            {count}
          </span>
        </button>
      )}
    </div>
  );
}
