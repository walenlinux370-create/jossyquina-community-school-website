import "server-only";
import { z } from "zod";

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

let cached: z.infer<typeof schema> | undefined;

function load() {
  if (!cached) {
    cached = schema.parse({
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
  }
  return cached;
}

// Lazy validation: env vars are only required when the server actually runs,
// not when Next.js imports modules during build-time page-data collection.
export const serverEnv = new Proxy({} as z.infer<typeof schema>, {
  get(_target, prop: keyof z.infer<typeof schema>) {
    return load()[prop];
  },
});
