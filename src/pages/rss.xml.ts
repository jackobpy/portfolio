import rss from "@astrojs/rss";
import { entries, href } from "../lib/content";
export async function GET() {
  const posts = await entries("writing");
  return rss({
    title: "Jakub Fręchowicz — Writing",
    description: "Notes on architecture, visualisations, software, and education.",
    site: "https://jakubfrechowicz.com",
    items: posts.map((e) => ({
      title: e.data.sample ? `[Sample] ${e.data.title}` : e.data.title,
      description: e.data.summary,
      pubDate: "publishedAt" in e.data ? e.data.publishedAt : undefined,
      link: href(e),
    })),
  });
}
