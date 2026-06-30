# Multi-Brand Deployment

This repository is now organized for separate frontend deployments with one shared backend/API.

## Vercel Projects

Use one Vercel project per app root:

- `apps/muslim-school` -> `muslimschoool.com`
- `apps/quran-care` -> `quran.care`
- `apps/murshiid` -> `murshiid.com`
- `apps/staff` -> `app.qawmilimited.com`

## Shared API

All frontend apps call the same backend:

- `NEXT_PUBLIC_API_BASE_URL=https://api.qawmilimited.com`

## App Environment

Each app must set:

- `NEXT_PUBLIC_APP_KIND=brand` for public/student brand apps
- `NEXT_PUBLIC_APP_KIND=staff` for the staff portal
- `NEXT_PUBLIC_BRAND_KEY=muslim-school | quran-care | murshiid`

## Current Migration Notes

- `apps/muslim-school` preserves the existing Muslim School app first.
- `apps/staff` preserves the existing dashboard app with staff-mode route blocking.
- `apps/quran-care` and `apps/murshiid` are independent brand app foundations with unique homepages.
- Shared logic lives in `packages/shared-*`.
- Do not run a local production build while a dev server is serving the same `.next` directory.
