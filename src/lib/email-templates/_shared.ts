export const brand = {
  bg: "#fff9f0",
  card: "#ffffff",
  primary: "#b88ab8",
  accent: "#d79b9f",
  text: "#4a3a4a",
  muted: "#8a7a8a",
  border: "#f0e4e4",
};

export function formatPln(grosze: number): string {
  return (grosze / 100).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
  });
}

export interface OrderItem {
  name: string;
  quantity: number;
  price_grosze: number;
}
