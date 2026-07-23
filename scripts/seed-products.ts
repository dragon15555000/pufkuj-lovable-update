import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Brak kluczy Supabase.");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const demoProductsRaw = [
  {
    slug: "osmiorniczka-koralowa",
    name: "Ośmiorniczka koralowa",
    short_description: "Miękka ośmiorniczka wykonana ręcznie na szydełku.",
    price_grosze: 3500,
    is_active: true,
    sort_order: 1,
    yarn_type: "Włóczka pluszowa",
    size: "ok. 10 cm"
  },
  {
    slug: "zolwik-mietowy",
    name: "Żółwik miętowy",
    short_description: "Mały żółwik z miękkiej włóczki, każdy z własnym charakterem.",
    price_grosze: 4500,
    is_active: true,
    sort_order: 2,
    yarn_type: "Włóczka pluszowa",
    size: "ok. 15 cm"
  },
  {
    slug: "axolotl-rozowy",
    name: "Axolotl różowy",
    short_description: "Kolorowy axolotl szydełkowany ręcznie, oczko po oczku.",
    price_grosze: 6000,
    is_active: true,
    sort_order: 3,
    yarn_type: "Włóczka chenille",
    size: "ok. 20 cm"
  },
];

async function seed() {
  for (const p of demoProductsRaw) {
    const { error } = await supabaseAdmin.from("products").insert(p);
    if (error) {
      console.error("Error inserting", p.name, error);
    } else {
      console.log("Inserted", p.name);
    }
  }
  console.log("Done!");
}

seed();
