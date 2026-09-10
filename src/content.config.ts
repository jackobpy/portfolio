import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const shared = z.object({
  title: z.string(),
  summary: z.string(),
  dateStart: month.optional(),
  dateEnd: month.optional(),
  status: z
    .enum(["current", "completed", "prospective", "archived"])
    .optional(),
  featured: z.boolean().default(false),
  featuredOrder: z.number().default(99),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional(),
  grade: z.string().optional(),
  links: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .default([]),
  relatedProjects: z.array(reference("projects")).default([]),
  relatedExperience: z.array(reference("experience")).default([]),
  relatedEducation: z.array(reference("education")).default([]),
  relatedWriting: z.array(reference("writing")).default([]),
  cv: z
    .object({
      show: z.boolean().default(false),
      priority: z.number().default(99),
      summary: z.array(z.string()).default([]),
    })
    .default({ show: false, priority: 99, summary: [] }),
  sample: z.boolean().default(false),
  art: z.enum(["pipeline", "latent", "matrix"]).optional(),
});
const entity = (name: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${name}` }),
    schema: shared.refine(
      (d) => !d.dateEnd || !d.dateStart || d.dateEnd >= d.dateStart,
      { message: "dateEnd must not precede dateStart" },
    ),
  });
export const collections = {
  projects: entity("projects"),
  experience: entity("experience"),
  education: entity("education"),
  writing: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: shared.extend({
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      type: z.enum(["article", "note", "project-log"]).default("article"),
      draft: z.boolean().default(true),
    }),
  }),
  pages: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
    schema: z.object({ title: z.string(), summary: z.string() }),
  }),
};
