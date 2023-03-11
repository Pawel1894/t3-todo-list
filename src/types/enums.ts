import { z } from "zod";

export const FiltersEnum = z.enum(["All", "Active", "Completed"]);
export type FiltersEnum = z.infer<typeof FiltersEnum>;
