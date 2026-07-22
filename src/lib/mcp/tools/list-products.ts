import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProducts } from "@/lib/onecart.functions";

export default defineTool({
  name: "list_products",
  title: "List Pufkuj products",
  description:
    "Return the current Pufkuj handmade product catalog (name, short description, price, purchase link). Falls back to demo data when the 1koszyk API is not configured.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum number of products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const { products, demo } = await getProducts();
    const items = (typeof limit === "number" ? products.slice(0, limit) : products).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.short_description,
      price: p.price_formatted,
      price_amount_grosze: p.price_amount,
      currency: p.price_currency,
      image: p.image_thumbnail ?? p.image,
      purchase_url: p.short_code_uri,
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ demo, count: items.length, products: items }, null, 2),
        },
      ],
      structuredContent: { demo, count: items.length, products: items },
    };
  },
});
