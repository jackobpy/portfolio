import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site: "https://frechowicz.com",
  integrations: [mdx(), sitemap()],
  output: "static",
  trailingSlash: "never",
});
