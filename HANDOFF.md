# ReviewNest — Full Project Handoff

This document is a complete handoff so a new Claude conversation can continue this project with zero context loss. Paste this entire document as the first message in the new chat.

---

## 1. Who I am / project context

I am the **non-technical project owner** at **EBI Consulting**, building **ReviewNest** — a Google Reviews Widget Platform. I have **ZERO coding knowledge**. I need **exact copy-paste commands** at every step. I work exclusively on **Windows using PowerShell** (not cmd, not bash). Never assume I can debug code myself — walk me through everything.

**Critical working agreements:**
- Stop and verify with me after each phase/step before proceeding.
- Never hardcode secrets — use `.env.local` locally, Vercel env vars in production. Never commit `.env` files to GitHub.
- All GitHub pushes go to the **Moe-Ebi** GitHub account only.
- I am on **Windows** — give PowerShell commands, not Unix/bash.

---

## 2. What ReviewNest is

A two-part platform:
1. **Admin/client dashboard** — connects Google Business Profiles via OAuth, manages review widgets.
2. **Embeddable widget** — a `<script>` tag clients paste on their own websites that displays their Google reviews (4 layout options: carousel, grid, list, badge).

Built in 8 phases (all phases 1–8 are complete and confirmed working). Key features:
- Supabase Postgres + Auth + Row Level Security
- Google Business Profile API via OAuth 2.0 (`business.manage` scope)
- Role-based access: **admin** (EBI Consulting team) vs **client** (business owners)
- Signup + approval flow: anyone can request access at `/signup`, an admin approves/denies from the dashboard
- Daily auto-sync of reviews via Vercel Cron (3am UTC)
- Public homepage, Privacy Policy, and Terms of Service (required for Google verification)
- Deployed to **Vercel**, live at **https://reviewnest.ebiconsulting.co.za**

---

## 3. Tech stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
  - ⚠️ Next.js 16 renamed `middleware.ts` → **`proxy.ts`**, and the exported function must be named `proxy` (not `middleware`). This is a breaking change from older Next.js docs/training data.
- **Supabase** — Postgres DB, Auth, Row Level Security (RLS) on all tables, service-role-only policies
- **Google Business Profile API** (OAuth 2.0, `business.manage` scope)
- **Vercel** — hosting + Cron Jobs (`vercel.json`)
- Shadow DOM for the embeddable widget (style isolation)
- Server Actions for all form submissions

---

## 4. Repo / file locations

- **Working directory (Windows):** `C:\Users\moeel\Downloads\Claude Developments\Google Review Widget for Clients\reviewnest`
- ⚠️ The git repo root is **inside** the `reviewnest` subfolder, NOT the parent "Google Review Widget for Clients" folder (that parent folder has spaces/capitals which broke `create-next-app`, so the app was scaffolded into the `reviewnest` subfolder instead). Always `cd` into `reviewnest` before running git commands.
- **GitHub repo:** `https://github.com/Moe-Ebi/review-nest.git`, branch `master`
- **Live site:** `https://reviewnest.ebiconsulting.co.za`
- **Vercel project:** under account `dev-4311`

### Key files
- `src/proxy.ts` — route guard (Next.js 16's replacement for middleware). Protects `/dashboard`, `/client`; redirects logged-in users away from `/login`/`/signup`.
- `src/lib/supabase/client.ts`, `server.ts`, `admin.ts` — Supabase client utilities (browser/server/service-role)
- `src/app/actions/auth.ts` — login/signup/logout server actions
- `src/app/actions/admin.ts` — approveRequest / denyRequest
- `src/app/actions/locations.ts` — addLocation (admin), addClientLocation (sets owner_email)
- `src/app/actions/sync.ts` — syncLocation
- `src/app/actions/settings.ts` — saveWidgetSettings
- `src/lib/google/locations.ts` — refreshAccessToken, fetchGoogleLocations (now has error logging added)
- `src/lib/google/reviews.ts` — syncReviewsForLocation
- `src/app/api/auth/google/route.ts` — admin Google OAuth init (`prompt: 'select_account consent'`)
- `src/app/api/auth/google/client/route.ts` — client Google OAuth init (same prompt setting)
- `src/app/api/auth/google/callback/route.ts` — OAuth callback, routes admin vs client via base64 `state` param
- `src/app/api/widget/[locationId]/route.ts` — public CORS-open widget data endpoint
- `src/app/api/cron/sync-reviews/route.ts` — Vercel Cron endpoint (secured with `CRON_SECRET` bearer token)
- `vercel.json` — cron schedule `0 3 * * *`
- `public/widget.js` — the embeddable widget script
- `src/app/page.tsx` — public homepage
- `src/app/privacy/page.tsx` — Privacy Policy (live at `/privacy`)
- `src/app/terms/page.tsx` — Terms of Service (live at `/terms`) — **just added this session**
- `src/app/login/page.tsx`, `src/app/signup/page.tsx` — auth pages
- `src/app/dashboard/...` — admin dashboard, location settings, connect flow
- `src/app/client/...` — client dashboard, connect flow
- `supabase/migrations/001` through `005` — all run successfully in production DB

---

## 5. Credentials / environment variables (DO NOT lose these again)

Local file: `reviewnest\.env.local` (NOT in GitHub):
```
NEXT_PUBLIC_SUPABASE_URL=https://ndeurgpivnhpfaxejmgt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<see .env.local>
SUPABASE_SERVICE_ROLE_KEY=<see .env.local>
GOOGLE_CLIENT_ID=223893667156-83v23d4ibklaat919g9eiipf3hg0usld.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<see .env.local>
NEXTAUTH_SECRET=<see .env.local>
NEXTAUTH_URL=http://localhost:3000   (Vercel prod uses https://reviewnest.ebiconsulting.co.za)
CRON_SECRET=<see .env.local>
```

**Supabase project:**
- Project ref: `ndeurgpivnhpfaxejmgt`
- Direct dashboard URL: `https://supabase.com/dashboard/project/ndeurgpivnhpfaxejmgt`
- ⚠️ **IMPORTANT:** This Supabase project is registered under a **different email/login** than my main `dev@ebiconsulting.co.za` Google Workspace account — I had lost track of which login owned it and had to search through multiple logged-in accounts to find it. I have now located it. If I ever get locked out again, the fix is: try logging into supabase.com with different emails/Google accounts I have access to, then go directly to `https://supabase.com/dashboard/project/ndeurgpivnhpfaxejmgt` to test access.

**Google Cloud project:**
- Project name: ReviewNest
- Project number: `223893667156`
- Project ID: `reviewnest-499207`

**My ReviewNest dashboard login:** I forgot my own ReviewNest password at one point. Fix process: Supabase Dashboard → Authentication → Users → find my email → three-dot menu → "Send password recovery" or "Reset password".

---

## 6. Google OAuth / Business Profile API — full history (IMPORTANT, recently resolved)

This was the main thread of work in the most recent session. Sequence of events:

1. **Initial problem:** Google OAuth showed "Access blocked" (403 access_denied) because the app was in Testing mode and only specific emails were added as test users.
2. **Solved long-term by submitting the app for Google verification** (production publishing), which removes the test-user restriction entirely for everyone.
3. **Verification steps completed:**
   - Created `/privacy` page (already existed) and `/terms` page (created this session) — both required by Google's Branding page.
   - Filled in Google Cloud Console → Google Auth Platform → Branding:
     - App homepage: `https://reviewnest.ebiconsulting.co.za`
     - Privacy policy: `https://reviewnest.ebiconsulting.co.za/privacy`
     - Terms of Service: `https://reviewnest.ebiconsulting.co.za/terms`
     - Authorised domain: `ebiconsulting.co.za`
   - Clicked "Verify branding" → **branding verified successfully** (green check).
   - Checked Verification Centre → Data access status said verification not required (business.manage isn't classified as a sensitive/restricted scope under Google's new Auth Platform).
   - **Result: app is fully verified and published to production.** Any Google account can now connect without being added as a test user.

4. **New problem discovered after publishing:** Connecting a Google account that has real Business Profile locations still showed "No locations found for this Google account."
   - Root cause #1 (ruled out): Google OAuth was reusing a cached browser session and not letting the user pick the right account. **Fix applied:** changed `prompt: 'consent'` to `prompt: 'select_account consent'` in both `src/app/api/auth/google/route.ts` and `src/app/api/auth/google/client/route.ts`. This forces Google's account picker to always appear. Committed and pushed (commit `1bf29dc`).
   - Even after picking the correct account (`moeellemdin325@gmail.com`, confirmed to be the account with real Business Profile access), locations still didn't load.
   - **Added debug logging** to `src/lib/google/locations.ts` (commit `2f86e5d`) to surface real Google API errors in Vercel logs instead of silently failing.
   - **Found root cause via Vercel logs:** `429 RESOURCE_EXHAUSTED` — `"quota_limit_value": "0"` for `mybusinessaccountmanagement.googleapis.com`. This meant Google had the API **enabled** but with a **default quota of zero** — this is normal for the Google Business Profile APIs; Google requires a **separate manual approval process** beyond just enabling the API in Cloud Console.
   - **Resolved by submitting a GBP API access request** via `https://developers.google.com/my-business/content/prereqs#request-access` → "GBP API contact form" → selected "Application For Basic API Access" → filled in:
     - Google Cloud project number: `223893667156`
     - Company website: `https://ebiconsulting.co.za`
     - Selected EBI Consulting's verified Google Business Profile (60+ days active) as the qualifying profile from the dropdown list (the same form also showed all the client business profiles EBI Consulting manages — all listed as "Verified", which was expected/correct, since EBI manages those clients' profiles).
   - **✅ APPROVAL RECEIVED** — Google sent the email: *"Congratulations! Your project has been approved to use the Google Business Profile API!"* Quota should now be raised from 0 to 300 QPM.

5. **Current status / what's NOT yet confirmed:** After receiving the approval email, I have **not yet re-tested** connecting a Google account and verifying locations actually load now. This is the **next immediate step** to verify before moving on.

---

## 7. Pending / next tasks (in priority order)

1. **Verify the GBP API fix worked** — go to `https://reviewnest.ebiconsulting.co.za/dashboard`, click "Connect Google Account," pick the Google account with real business locations (e.g. `moeellemdin325@gmail.com`), and confirm locations now actually load (they previously failed with quota=0, which should now be fixed since Google approved API access).
2. **Connect my boss Ebrahim's Google account** to the platform so his business profile(s) can be tracked.
   - Note: I previously lost the login to Ebrahim's Google account — this still needs to be resolved with him directly (password reset / recovery, since it's his account, not mine).
3. **Add Ebrahim as a ReviewNest user** — once his Google account access is sorted, he should sign up at `/signup` and I approve him from the admin dashboard (or I add his account directly).
4. General ongoing maintenance: review/onboard new clients via the existing signup+approval flow as needed.

---

## 8. Style/communication preferences for the assistant

- Always give **exact PowerShell commands** I can copy-paste — I will not write or debug code myself.
- When something requires clicking through a web UI (Google Cloud Console, Supabase, Vercel), give **step-by-step instructions** referencing exact button/link text, and ask me to send a screenshot if results are unexpected.
- Push to git only when explicitly appropriate for the task (e.g., a code fix) — always confirm before destructive actions.
- Keep responses concise and action-oriented; I am following along live, often mid-task on screen.
