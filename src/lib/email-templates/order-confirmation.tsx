import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { brand, formatPln, type OrderItem } from "./_shared";

interface Props {
  customerName?: string;
  orderId?: string;
  items?: OrderItem[];
  itemsTotalGrosze?: number;
  shippingLabel?: string;
  shippingCostGrosze?: number;
  totalGrosze?: number;
  shippingStreet?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
}

const Email = ({
  customerName = "Kliencie",
  orderId = "",
  items = [],
  itemsTotalGrosze = 0,
  shippingLabel = "Kurier",
  shippingCostGrosze = 1800,
  totalGrosze = 0,
  shippingStreet = "",
  shippingPostalCode = "",
  shippingCity = "",
}: Props) => (
  <Html lang="pl" dir="ltr">
    <Head />
    <Preview>Dziękujemy za zamówienie w Pufkuj ♥</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Dziękujemy, {customerName}! ♥</Heading>
        <Text style={p}>
          Twoje zamówienie zostało opłacone i przyjęte do realizacji. Każda
          maskotka Pufkuj powstaje ręcznie z pasją — damy Ci znać, gdy paczka
          wyruszy w drogę.
        </Text>

        <Section style={card}>
          <Text style={label}>Numer zamówienia</Text>
          <Text style={code}>{orderId.slice(0, 8).toUpperCase()}</Text>
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Zamówione produkty</Heading>
          {items.map((it, i) => (
            <Text key={i} style={itemRow}>
              <span>{it.name} × {it.quantity}</span>
              <span style={itemPrice}>{formatPln(it.price_grosze * it.quantity)}</span>
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={itemRow}>
            <span>Produkty</span>
            <span>{formatPln(itemsTotalGrosze)}</span>
          </Text>
          <Text style={itemRow}>
            <span>{shippingLabel}</span>
            <span>{formatPln(shippingCostGrosze)}</span>
          </Text>
          <Hr style={hr} />
          <Text style={{ ...itemRow, fontWeight: 700, fontSize: 16 }}>
            <span>Razem</span>
            <span>{formatPln(totalGrosze)}</span>
          </Text>
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Adres dostawy</Heading>
          <Text style={p}>
            {customerName}<br />
            {shippingStreet}<br />
            {shippingPostalCode} {shippingCity}
          </Text>
        </Section>

        <Text style={muted}>
          Masz pytanie? Odpisz na tego maila lub napisz na kontakt@pufkuj.pl.
        </Text>
        <Text style={muted}>Pufkuj — Gorzów Wielkopolski</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Dziękujemy za zamówienie w Pufkuj ♥ (#${String(data?.orderId ?? "").slice(0, 8).toUpperCase()})`,
  displayName: "Potwierdzenie zamówienia",
  previewData: {
    customerName: "Anna",
    orderId: "abcd1234-5678",
    items: [
      { name: "Pufka różowa", quantity: 1, price_grosze: 8900 },
      { name: "Pufka miętowa", quantity: 2, price_grosze: 8900 },
    ],
    itemsTotalGrosze: 26700,
    shippingLabel: "Kurier",
    shippingCostGrosze: 1800,
    totalGrosze: 28500,
    shippingStreet: "ul. Kwiatowa 5",
    shippingPostalCode: "66-400",
    shippingCity: "Gorzów Wielkopolski",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", color: brand.text };
const container = { padding: "24px", maxWidth: "560px", margin: "0 auto" };
const h1 = { color: brand.primary, fontSize: 24, margin: "0 0 12px" };
const h2 = { color: brand.text, fontSize: 16, margin: "0 0 12px" };
const p = { color: brand.text, fontSize: 14, lineHeight: "22px", margin: "0 0 12px" };
const muted = { color: brand.muted, fontSize: 12, margin: "8px 0" };
const card = { background: brand.bg, borderRadius: 12, padding: "16px 20px", margin: "16px 0", border: `1px solid ${brand.border}` };
const label = { color: brand.muted, fontSize: 12, margin: 0, textTransform: "uppercase" as const, letterSpacing: 0.5 };
const code = { color: brand.text, fontSize: 18, fontWeight: 700, margin: "4px 0 0", fontFamily: "monospace" };
const itemRow = { color: brand.text, fontSize: 14, margin: "6px 0", display: "flex", justifyContent: "space-between" };
const itemPrice = { fontWeight: 600 };
const hr = { borderColor: brand.border, margin: "12px 0" };
