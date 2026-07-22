import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type SizeKey = "maly" | "sredni" | "duzy" | "xl";
type ComplexityKey = "prosty" | "standardowy" | "szczegolowy";

const sizes: Record<SizeKey, { label: string; hint: string; from: number; to: number }> = {
  maly: { label: "Mały (~10 cm)", hint: "brelok, mały prezent", from: 25, to: 35 },
  sredni: { label: "Średni (~20 cm)", hint: "klasyczna maskotka", from: 40, to: 60 },
  duzy: { label: "Duży (~30 cm)", hint: "przytulanka do łóżka", from: 70, to: 100 },
  xl: { label: "XL (~40 cm+)", hint: "efektowna, na prezent", from: 120, to: 180 },
};

const complexities: Record<ComplexityKey, { label: string; hint: string; multiplier: number }> = {
  prosty: { label: "Prosty", hint: "jeden kolor, gładki kształt", multiplier: 1 },
  standardowy: { label: "Standardowy", hint: "kilka kolorów, detale", multiplier: 1.3 },
  szczegolowy: { label: "Szczegółowy", hint: "wiele elementów, ubranka", multiplier: 1.7 },
};

const palette = [
  { name: "Różowy", hex: "#f2c6d1" },
  { name: "Miętowy", hex: "#a9d5c1" },
  { name: "Lawendowy", hex: "#c9b8e6" },
  { name: "Koralowy", hex: "#d79b9f" },
  { name: "Kremowy", hex: "#f5ead3" },
  { name: "Szary", hex: "#c9c4c9" },
  { name: "Biały", hex: "#ffffff" },
  { name: "Czarny", hex: "#343137" },
];

const MAX_PHOTO_MB = 8;
const STORAGE_KEY = "pufki:custom-order-draft:v1";
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function formatPln(value: number) {
  return `${Math.round(value)} zł`;
}

function validateContact(value: string): string | null {
  const v = value.trim();
  if (!v) return "Podaj e-mail lub nick na Instagramie, żebym mogła się odezwać.";
  if (v.length > 120) return "Kontakt jest za długi (maks. 120 znaków).";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isHandle = /^@?[a-zA-Z0-9._]{2,30}$/.test(v);
  if (!isEmail && !isHandle) {
    return "Wpisz poprawny e-mail (np. kasia@example.com) lub nick (np. @kasia).";
  }
  return null;
}

function validateDescription(value: string): string | null {
  const v = value.trim();
  if (v.length > 0 && v.length < 10) {
    return "Dodaj kilka słów więcej (min. 10 znaków), łatwiej wtedy wycenić.";
  }
  if (v.length > 1000) return "Opis jest za długi (maks. 1000 znaków).";
  return null;
}

export function CustomOrderForm() {
  const [size, setSize] = useState<SizeKey>("sredni");
  const [complexity, setComplexity] = useState<ComplexityKey>("standardowy");
  const [colors, setColors] = useState<string[]>(["Koralowy"]);
  const [otherColor, setOtherColor] = useState("");
  const [otherActive, setOtherActive] = useState(false);
  const [rush, setRush] = useState(false);
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ contact?: string; description?: string; colors?: string; other?: string }>({});
  const [touched, setTouched] = useState<{ contact?: boolean; description?: boolean }>({});
  const [pricePulse, setPricePulse] = useState(false);
  const priceRef = useRef<HTMLElement>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore draft from localStorage after hydration (SSR-safe)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Partial<{
          size: SizeKey;
          complexity: ComplexityKey;
          colors: string[];
          otherColor: string;
          otherActive: boolean;
          rush: boolean;
          description: string;
          contact: string;
          photoName: string | null;
        }>;
        if (d.size && d.size in sizes) setSize(d.size);
        if (d.complexity && d.complexity in complexities) setComplexity(d.complexity);
        if (Array.isArray(d.colors)) setColors(d.colors);
        if (typeof d.otherColor === "string") setOtherColor(d.otherColor);
        if (typeof d.otherActive === "boolean") setOtherActive(d.otherActive);
        if (typeof d.rush === "boolean") setRush(d.rush);
        if (typeof d.description === "string") setDescription(d.description);
        if (typeof d.contact === "string") setContact(d.contact);
        if (typeof d.photoName === "string") setPhotoName(d.photoName);
        const hasContent =
          (d.description && d.description.trim().length > 0) ||
          (d.contact && d.contact.trim().length > 0);
        if (hasContent) {
          toast.info("Przywróciłam Twój ostatni szkic zamówienia ✨", {
            action: { label: "Wyczyść", onClick: () => resetDraft() },
          });
        }
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft on change (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          size, complexity, colors, otherColor, otherActive,
          rush, description, contact, photoName,
        }),
      );
    } catch {
      /* quota or privacy mode — ignore */
    }
  }, [hydrated, size, complexity, colors, otherColor, otherActive, rush, description, contact, photoName]);

  function resetDraft() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSize("sredni");
    setComplexity("standardowy");
    setColors(["Koralowy"]);
    setOtherColor("");
    setOtherActive(false);
    setRush(false);
    setDescription("");
    setContact("");
    setPhotoName(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoError(null);
    setErrors({});
    setTouched({});
    toast.success("Szkic wyczyszczony.");
  }

  const price = useMemo(() => {
    const s = sizes[size];
    const m = complexities[complexity].multiplier;
    const rushMul = rush ? 1.2 : 1;
    return {
      from: Math.round(s.from * m * rushMul),
      to: Math.round(s.to * m * rushMul),
    };
  }, [size, complexity, rush]);

  useEffect(() => {
    setPricePulse(true);
    const t = setTimeout(() => setPricePulse(false), 350);
    return () => clearTimeout(t);
  }, [price.from, price.to]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const contactError = touched.contact ? validateContact(contact) : null;
  const descriptionError = touched.description ? validateDescription(description) : null;

  function toggleColor(name: string) {
    setColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    if (!file) {
      setPhotoName(null);
      setPhotoPreview(null);
      setPhotoError(null);
      return;
    }
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Dozwolone formaty: JPG, PNG, WEBP lub HEIC.");
      setPhotoName(null);
      setPhotoPreview(null);
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoError(`Plik jest za duży — maks. ${MAX_PHOTO_MB} MB.`);
      setPhotoName(null);
      setPhotoPreview(null);
      e.target.value = "";
      return;
    }
    setPhotoError(null);
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    const c = validateContact(contact);
    if (c) nextErrors.contact = c;
    const d = validateDescription(description);
    if (d) nextErrors.description = d;
    const hasOther = otherActive && otherColor.trim().length > 0;
    if (colors.length === 0 && !hasOther) nextErrors.colors = "Wybierz przynajmniej jeden kolor włóczki.";
    if (otherActive && otherColor.trim().length === 0) nextErrors.other = "Wpisz nazwę koloru lub odznacz „Inny”.";
    setTouched({ contact: true, description: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Uzupełnij zaznaczone pola — sprawdź komunikaty przy polach.");
      return;
    }

    const allColors = [...colors, ...(hasOther ? [`inny: ${otherColor.trim()}`] : [])];
    const subject = encodeURIComponent(`Zapytanie o maskotkę na zamówienie — ${sizes[size].label}`);
    const body = encodeURIComponent(
      [
        `Rozmiar: ${sizes[size].label}`,
        `Poziom detali: ${complexities[complexity].label}`,
        `Kolory: ${allColors.join(", ")}`,
        `Priorytetowa realizacja: ${rush ? "tak (+20%)" : "nie"}`,
        `Szacunkowa cena: ${formatPln(price.from)} – ${formatPln(price.to)}`,
        "",
        "Opis / inspiracja:",
        description.trim() || "(brak)",
        "",
        photoName ? `Załącznik do wysłania osobno: ${photoName}` : "",
        "",
        `Kontakt: ${contact.trim()}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    toast.success("Otwieram wiadomość — dołącz zdjęcie w załączniku ✉️");
    window.location.href = `mailto:kontakt@pufkuj.pl?subject=${subject}&body=${body}`;
  }

  const contactMsg = errors.contact ?? contactError;
  const descriptionMsg = errors.description ?? descriptionError;

  return (
    <form className="customForm" onSubmit={handleSubmit} noValidate>
      <div className="customForm__head">
        <h3>Kalkulator zamówienia</h3>
        <p>Wybierz rozmiar, kolory i detale — zobaczysz szacunkową cenę od ręki.</p>
      </div>

      <fieldset className="customForm__group">
        <legend>Rozmiar *</legend>
        <div className="customForm__chips" role="radiogroup" aria-label="Rozmiar maskotki">
          {(Object.keys(sizes) as SizeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={size === key}
              className={`chip ${size === key ? "chip--active" : ""}`}
              onClick={() => setSize(key)}
            >
              <strong>{sizes[key].label}</strong>
              <span>{sizes[key].hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="customForm__group">
        <legend>Poziom detali</legend>
        <div className="customForm__chips" role="radiogroup" aria-label="Poziom detali">
          {(Object.keys(complexities) as ComplexityKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={complexity === key}
              className={`chip ${complexity === key ? "chip--active" : ""}`}
              onClick={() => setComplexity(key)}
            >
              <strong>{complexities[key].label}</strong>
              <span>{complexities[key].hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="customForm__group">
        <legend>Kolory włóczki (możesz wybrać kilka)</legend>
        <div className="customForm__colors">
          {palette.map((c) => {
            const active = colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                className={`swatch ${active ? "swatch--active" : ""}`}
                onClick={() => toggleColor(c.name)}
                aria-pressed={active}
                aria-label={c.name}
              >
                <span className="swatch__dot" style={{ background: c.hex }}>
                  {active && <span className="swatch__check" aria-hidden="true">✓</span>}
                </span>
                <span className="swatch__name">{c.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            className={`swatch swatch--other ${otherActive ? "swatch--active" : ""}`}
            onClick={() => setOtherActive((v) => !v)}
            aria-pressed={otherActive}
          >
            <span className="swatch__dot swatch__dot--other" aria-hidden="true">+</span>
            <span className="swatch__name">Inny…</span>
          </button>
        </div>
        {otherActive && (
          <input
            type="text"
            className="customForm__otherInput"
            value={otherColor}
            onChange={(e) => setOtherColor(e.target.value)}
            placeholder="Opisz kolor (np. brudny róż, ombré)"
            maxLength={60}
            aria-invalid={Boolean(errors.other)}
          />
        )}
        {errors.other && <p className="customForm__error" role="alert">{errors.other}</p>}
        {errors.colors && <p className="customForm__error" role="alert">{errors.colors}</p>}
      </fieldset>

      <label className="customForm__check">
        <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} />
        <span>Priorytetowa realizacja (+20% do ceny)</span>
      </label>

      <div className="customForm__grid">
        <label className="customForm__field customForm__field--wide">
          <span>Opis maskotki</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            placeholder="Opisz wymarzoną maskotkę, kolor, wzór, inspirację…"
            maxLength={1000}
            aria-invalid={Boolean(descriptionMsg)}
            aria-describedby="desc-hint desc-error"
          />
          <small id="desc-hint" className="customForm__hint">
            Im więcej szczegółów (rozmiar, kolor oczu, dodatki), tym trafniejsza wycena. {description.trim().length}/1000
          </small>
          {descriptionMsg && (
            <p id="desc-error" className="customForm__error" role="alert">{descriptionMsg}</p>
          )}
        </label>

        <label className="customForm__field">
          <span>Zdjęcie inspiracji (opcjonalnie)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handlePhoto}
            aria-invalid={Boolean(photoError)}
            aria-describedby="photo-hint photo-error"
          />
          <small id="photo-hint" className="customForm__hint">
            JPG, PNG, WEBP lub HEIC — maks. {MAX_PHOTO_MB} MB. Zdjęcie dołącz w wiadomości.
          </small>
          {photoPreview && !photoError && (
            <div className="customForm__preview">
              <img src={photoPreview} alt="Podgląd zdjęcia inspiracji" />
              <em className="customForm__file">{photoName}</em>
            </div>
          )}
          {photoError && (
            <p id="photo-error" className="customForm__error" role="alert">{photoError}</p>
          )}
        </label>

        <label className="customForm__field">
          <span>Twój kontakt (e-mail lub Instagram) *</span>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
            placeholder="np. kasia@example.com lub @kasia"
            required
            maxLength={120}
            autoComplete="email"
            aria-invalid={Boolean(contactMsg)}
            aria-describedby="contact-hint contact-error"
          />
          <small id="contact-hint" className="customForm__hint">
            Nie udostępniam nikomu — używam tylko do odpowiedzi na zapytanie.
          </small>
          {contactMsg && (
            <p id="contact-error" className="customForm__error" role="alert">{contactMsg}</p>
          )}
        </label>
      </div>

      <div className="customForm__summary">
        <div>
          <span className="customForm__summaryLabel">Szacunkowa cena</span>
          <strong
            ref={priceRef}
            className={`customForm__price ${pricePulse ? "customForm__price--pulse" : ""}`}
            aria-live="polite"
          >
            {formatPln(price.from)} – {formatPln(price.to)}
          </strong>
          <p className="customForm__note">
            Dokładną cenę potwierdzimy przed rozpoczęciem pracy. Wysyłka liczona osobno.
          </p>
        </div>
        <div className="customForm__actions">
          <button type="submit" className="orderCta">
            Wyślij zapytanie <span aria-hidden="true">↗</span>
          </button>
          <a
            className="orderCta orderCta--ghost"
            href="https://www.instagram.com/pufkuj.pl/"
            target="_blank"
            rel="noreferrer"
          >
            Lub napisz na Instagramie <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </form>
  );
}
