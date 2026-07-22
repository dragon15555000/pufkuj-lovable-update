import { createServerFn } from "@tanstack/react-start";
import storiesJson from "@/data/tiktok-stories.json";

export type TiktokStory = {
  href: string;
  title: string;
  alt: string;
  image: string;
};

type RawStory = {
  href: string;
  title: string;
  alt: string;
  image?: string;
};

const FALLBACK_IMAGE = "/assets/tiktok/pierwszy-targ.jpg";

async function fetchOEmbedThumbnail(href: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(href)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string };
    return data.thumbnail_url ?? null;
  } catch {
    return null;
  }
}

export const getTiktokStories = createServerFn({ method: "GET" }).handler(
  async (): Promise<TiktokStory[]> => {
    const raw = storiesJson as RawStory[];
    const enriched = await Promise.all(
      raw.map(async (story) => {
        if (story.image) return { ...story, image: story.image };
        const thumb = await fetchOEmbedThumbnail(story.href);
        return { ...story, image: thumb ?? FALLBACK_IMAGE };
      }),
    );
    return enriched;
  },
);
