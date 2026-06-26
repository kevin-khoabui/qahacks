import { D1Database } from '@cloudflare/workers-types';

declare module '@cloudflare/next-on-pages' {
  interface CloudflareEnv {
    DB: D1Database;
  }
}