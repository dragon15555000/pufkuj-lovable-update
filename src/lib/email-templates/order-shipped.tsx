import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";
import { brand } from "./_shared";

interface Props {
  customerName?: string;
  orderId?: string;
  shippingStreet?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
}

const Email = ({
  customerName = "Kliencie",
  orderId = "",
  shippingStreet = "",
  shippingPostalCode = "",
  shippingCity = "",
}: Props) => (
  <Html lang="pl" dir="ltr">
    <Head />
    <Preview>Twoja paczka od Pufkuj jest w drodze ♥</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Paczka jest w drodze! 📦</Heading>
        <Text style={p}>
          Cześć {customerName}, właśnie nadaliśmy Twoje zamówienie{" "}
          <strong>#{orderId.slice(0, 8).toUpperCase()}</strong> kurierem na adres:
        </Text>
        <Section style={card}>
          <Text style={p}>
            {shippingStreet}<br />
            {shippingPostalCode} {shippingCity}
          </Text>
        </Section>
        <Text style={p}>
          Kurier dostarczy paczkę zwykle w ciągu 1–2 dni roboczych. Jeśli coś
          będzie nie tak, odpisz na tego maila lub napisz na kontakt@pufkuj.pl —
          jesteśmy do pomocy.
        </Text>
        <Text style={muted}>Dziękujemy, że wybrałeś Pufkuj ♥</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Twoja paczka Pufkuj jest w drodze 📦 (#${String(data?.orderId ?? "").slice(0, 8).toUpperCase()})`,
  displayName: "Wysyłka zamówienia",
  previewData: {
    customerName: "Anna",
    orderId: "abcd1234-5678",
    shippingStreet: "ul. Kwiatowa 5",
    shippingPostalCode: "66-400",
    shippingCity: "Gorzów Wielkopolski",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", color: brand.text };
const container = { padding: "24px", maxWidth: "560px", margin: "0 auto" };
const h1 = { color: brand.primary, fontSize: 24, margin: "0 0 12px" };
const p = { color: brand.text, fontSize: 14, lineHeight: "22px", margin: "0 0 12px" };
const muted = { color: brand.muted, fontSize: 12, margin: "8px 0" };
const card = { background: brand.bg, borderRadius: 12, padding: "16px 20px", margin: "16px 0", border: `1px solid ${brand.border}` };
