import { defineEnv, string } from 'void/env'

// Server secrets for the Cloudflare Worker. Local values live in .env;
// production values are set with `void secret put` / `void secret sync`.
// All three are required at deploy time: the microCMS pair feeds the
// Content Layer at build (and any on-demand routes), RESEND_API_KEY backs
// the contact API route.
export default defineEnv({
  MICROCMS_SERVICE_DOMAIN: string(),
  MICROCMS_API_KEY: string(),
  RESEND_API_KEY: string(),
})
