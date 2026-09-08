import { getCollection, type CollectionEntry } from "astro:content";
export const kinds = [
  "projects",
  "experience",
  "education",
  "writing",
] as const;
export type Kind = (typeof kinds)[number];
export type Entry = CollectionEntry<Kind>;
export const labels: Record<Kind, string> = {
  projects: "Project",
  experience: "Experience",
  education: "Education",
  writing: "Writing",
};
export const href = (e: Entry) => `/${e.collection}/${e.id}`;
export function period(e: Entry) {
  const d = e.data;
  const format = (v: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(v + "-01T00:00:00Z"));
  if (!d.dateStart)
    return d.dateEnd ? `Completed ${format(d.dateEnd)}` : "Date not specified";
  return `${format(d.dateStart)}${d.dateEnd ? " — " + format(d.dateEnd) : d.status === "current" ? " — Present" : d.status === "prospective" ? " · Prospective" : ""}`;
}
export async function entries(kind: Kind): Promise<Entry[]> {
  const all = await getCollection(kind);
  return all
    .filter((e) => !("draft" in e.data && e.data.draft))
    .sort((a, b) =>
      kind === "writing"
        ? ("publishedAt" in b.data ? b.data.publishedAt.getTime() : 0) -
          ("publishedAt" in a.data ? a.data.publishedAt.getTime() : 0)
        : a.data.featuredOrder - b.data.featuredOrder ||
          (b.data.dateStart ?? "").localeCompare(a.data.dateStart ?? ""),
    );
}
export async function graph() {
  const all = (await Promise.all(kinds.map(entries))).flat();
  for (const e of all) {
    for (const r of references(e)) {
      const targets = await getCollection(r.collection);
      if (!targets.some((t) => t.id === r.id))
        throw new Error(
          `Broken reference in ${href(e)}: ${r.collection}/${r.id}`,
        );
    }
  }
  return all;
}
export const references = (e: Entry) => [
  ...e.data.relatedProjects,
  ...e.data.relatedExperience,
  ...e.data.relatedEducation,
  ...e.data.relatedWriting,
];
export async function related(e: Entry) {
  const all = await graph();
  const refs = references(e);
  return all.filter(
    (t) =>
      href(t) !== href(e) &&
      (refs.some((r) => r.collection === t.collection && r.id === t.id) ||
        references(t).some(
          (r) => r.collection === e.collection && r.id === e.id,
        )),
  );
}
export const readingTime = (e: Entry) =>
  Math.max(1, Math.ceil((e.body ?? "").split(/\s+/).length / 220));
