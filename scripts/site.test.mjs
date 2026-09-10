import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
async function files(dir) {
  const out = [];
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...(await files(p)));
    else out.push(p);
  }
  return out;
}
const all = await files(root);
const html = all.filter((p) => p.endsWith(".html"));
test("public routes build and every page has one h1 and canonical metadata", async () => {
  assert.ok(html.length >= 20);
  for (const f of html) {
    const s = await readFile(f, "utf8");
    assert.equal((s.match(/<h1(?:\s|>)/g) || []).length, 1, f);
    assert.match(s, /<link rel="canonical" href="https:\/\/jakubfrechowicz.com/);
    assert.match(s, /<meta name="description"/);
  }
});
test("all internal navigation and asset references resolve", async () => {
  for (const f of html) {
    const s = await readFile(f, "utf8");
    for (const [, url] of s.matchAll(
      /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
    )) {
      if (url.startsWith("//")) continue;
      const dest = path.join(root, decodeURIComponent(url));
      let found = false;
      for (const candidate of [
        dest,
        path.join(dest, "index.html"),
        dest + ".html",
      ]) {
        try {
          if ((await stat(candidate)).isFile()) {
            found = true;
            break;
          }
        } catch {}
      }
      assert.ok(found, `${f}: ${url}`);
    }
  }
});
test("draft content is absent from all production artifacts", async () => {
  for (const f of all) {
    if (!/\.(html|xml|js|json)$/.test(f)) continue;
    const s = await readFile(f, "utf8");
    assert.ok(!s.includes("PRIVATE_DRAFT_SENTINEL"), f);
    assert.ok(!s.includes("/writing/draft-example"), f);
  }
});
test("CV and collection pages use the same corrected GPA", async () => {
  for (const f of ["cv/index.html", "education/tu-delft/index.html"])
    assert.match(await readFile(path.join(root, f), "utf8"), /9\.12/);
});
test("RSS, sitemap and 404 exist", async () => {
  for (const f of ["rss.xml", "sitemap-index.xml", "sitemap-0.xml", "404.html"])
    assert.ok((await stat(path.join(root, f))).isFile());
});
test("raw personal documents and identifiers are not published", async () => {
  for (const f of html) {
    const s = await readFile(f, "utf8");
    assert.ok(!s.includes("5987350"));
    assert.ok(!s.includes("March 30, 2004"));
  }
  assert.deepEqual(
    all.filter((f) => f.endsWith(".pdf")).map((f) => path.basename(f)),
    ["tu-delft-academic-record-redacted.pdf"],
  );
});
