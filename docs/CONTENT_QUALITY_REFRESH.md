# QA Hacks Interview Library Quality Refresh

## Branches

- Backup: `backup-before-content-cleanup-20260805`
- Working branch: `feature/interview-library-quality-refresh`

## What changed

- Added backward-compatible `published`, `draft`, `archived`, and `duplicate` content states.
- Added quality score, normalized question fingerprint, duplicate reference, and review timestamp fields.
- Updated the homepage to feature a curated first set and reduce the content-farm appearance.
- Added a safe D1 audit that produces reports without deleting data.
- Changed generated-post imports to local D1 by default.
- Remote imports now require both `--remote` and `--confirm` and are saved as `draft`.

## Local verification

```bash
git fetch origin
git switch feature/interview-library-quality-refresh
npm ci
npm run build
```

Apply the quality migration to local D1:

```bash
npm run migrate:quality:local
```

Run a local audit:

```bash
npm run audit:content
```

Review:

- `reports/content-audit.json`
- `reports/archive-candidates.sql`

Start the site:

```bash
npm run dev
```

Check:

- Homepage shows a Featured interview questions section.
- The remaining library is paginated at 18 cards per page.
- Existing posts remain visible before any records are archived.
- A record with `status = 'draft'` or `status = 'archived'` is hidden.

## Remote audit — read only

Authenticate Wrangler first, then run:

```bash
npm run audit:content:remote
```

This command reads remote D1 and creates local report files. It does not modify remote D1.

## Remote migration

Only after the local build and audit succeed:

```bash
npm run migrate:quality:remote
```

The migration defaults all existing records to `published`, so applying it does not hide existing content.

## Archive review

Do not run `reports/archive-candidates.sql` without reviewing every slug. It archives candidates; it does not delete them.

Example after review:

```bash
npx wrangler d1 execute qahacks-db --remote --file reports/archive-candidates.sql
```

## Generated content safety

Local draft import:

```bash
npm run import:post
```

Remote draft import:

```bash
npm run import:post -- --remote --confirm
```

New generated records are stored as `draft` and remain hidden until explicitly promoted:

```sql
UPDATE posts
SET status = 'published', reviewed_at = datetime('now')
WHERE slug = 'reviewed-question-slug';
```
