# Menopause Compass

One responsive, installable educational web app with two audiences:

- **Patient Guide** (`/`, `/learn`): plain-language answers, topic hubs, search with synonyms, and a local-only visit-prep checklist.
- **MSCP Academy** (`/academy`): certification path, 10 Quick Review modules, a practice engine (tutor, timed, weak-area, demo), an AI prompt toolkit built on the PROVE concierge, and local progress tracking.

No accounts, no server, no analytics. All user data stays in the browser (localStorage + IndexedDB).

Built to the *Menopause Compass Master Build Specification v1.0 (Oct 2026)*.

---

## Deploy on Netlify (GitHub-connected)

1. Create a GitHub repo (for example `menopause-compass`) and push this folder:
   ```bash
   git remote add origin git@github.com:<you>/menopause-compass.git
   git push -u origin main
   git push -u origin preview
   ```
2. In Netlify: **Add new site → Import an existing project → GitHub →** pick the repo.
3. Build settings are read from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node 20
4. Branch deploys: enable **Deploy previews / Branch deploys** for `preview` so you can review there before merging to `main`.

`netlify.toml` already includes the SPA redirect (`/* → /index.html 200`), security headers, long-term caching for hashed assets, and `no-cache` for the service worker.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests: content integrity, search, quiz engine, storage
npm run build        # type-check + production build to dist/
npm run preview      # serve dist/ on http://localhost:4173
npm run qa           # optional: responsive + flow QA (needs Python Playwright, preview running)
```

The dev server also exposes a **clinical review queue** at `/academy/editor` (development only; not in production builds).

---

## Content: where it lives and how to review it

```
src/content/
  sources.ts        Source registry (position statements, FDA updates, ACOG, handbook)
  facts.ts          50 Reviewable Facts: shared evidence layer → patient + clinician renderings
  topics.ts         11 patient topic hubs
  faqs.ts           31 patient FAQs
  modules.ts        10 Quick Review modules (one-minute review, traps, tables, pearls)
  questions.json    225 practice items (3-option format, mirrors the current exam)
  certification.ts  MSCP facts with lastVerified / validThrough
  prompts.ts        AI Toolkit prompts (PROVE-based)
  visitQuestions.ts Visit-prep question bank
src/config.ts       PREVIEW_EDITION flag, editor name, feedback email
```

### Release status in this build
- **All content is `draft`** (AI-drafted from the attached position statements, the A–Z extraction and your PROVE knowledge pack). Every page shows "Draft · clinical review pending".
- **Scored practice is locked** until items are verified. A clearly labeled **Demo (unscored)** mode lets you exercise every feature now.
- A site-wide **Preview edition** banner is on (`PREVIEW_EDITION = true` in `src/config.ts`).

### Review workflow
1. **Facts** (`src/content/facts.ts`): edit wording, then set `status: 'reviewed'`, `lastReviewed: 'YYYY-MM-DD'`, `reviewer: 'Name'`. The `f()` helper sets drafts by default — pass these fields explicitly to override.
2. **Questions**: run `npm run dev`, open `/academy/editor`, click **Verify** on items you approve, then **Download questions.json** and replace `src/content/questions.json`. Only `status: "verified"` items appear in scored modes.
3. **Modules** (`modules.ts`): set `status` and `lastReviewed` per module.
4. Run `npm test`. The content test fails on broken references, duplicate IDs, malformed answer keys, or anything marked reviewed/verified without a reviewer and date.
5. When everything patient-facing is reviewed, set `PREVIEW_EDITION = false`.
6. Bump `CONTENT_RELEASE` (and `CONTENT_VERSION` if saved progress could be affected) in `src/content/index.ts`.

### Certification data
`certification.ts` was verified on **2026-10-28** against menopause.org and the **2027 Candidate Handbook**. After `validThrough` (2027-11-30) the UI automatically hides dates and fees and shows "Check official site". Re-verify each cycle.

### Things to set before launch
- `FEEDBACK_EMAIL` in `src/config.ts` (currently a placeholder).
- Review the patient language with a second reader for readability.

---

## Deliberate deviations from the spec (and why)

| Spec | Built | Reason |
|---|---|---|
| Questions with 4–5 choices | 3 options (A–C); schema allows 3–5 | The 2027 MSCP handbook states 100 three-option items. Practice mirrors the real format. |
| Slate `#647875`, Terracotta `#B9634D` for text | Text uses `#5A6D6A` / `#A2533F`; original hexes kept for icons/borders | Original values fall below WCAG AA 4.5:1 on ivory and sage. |
| Official link `/professional-resources/mscp-certification` | `/for-professionals/mscp-certification` | Verified current URL on 2026-10-28. |
| Google-hosted Inter | Self-hosted Inter (Fontsource) | Works offline in the PWA and avoids a third-party request. |
| shadcn/ui | Lightweight local components on Tailwind tokens | Fewer dependencies; same patterns (accessible accordion, combobox, segmented control). |

### Content currency flags built in
- **FDA HT labeling** (Nov 2025 initiation, Feb 12 2026 approvals): CVD, breast cancer and probable dementia removed from the boxed warning; endometrial cancer boxed warning kept for systemic estrogen-alone; "lowest dose for shortest duration" removed. HT 2022 and GSM 2020 are marked *partly superseded*.
- **Fezolinetant** hepatic boxed warning (Dec 2024) with the monitoring schedule.
- **Elinzanetant** FDA approval (Oct 2025), noted as postdating the 2023 nonhormone statement.
- The A–Z extraction line "aged older than 60 years or within 10 years" (slide 185) appears to be a typo for *younger than 60*; content follows the HT 2022 wording.

---

## Architecture

- React 18 + TypeScript + Vite, React Router (academy routes code-split), Tailwind CSS with CSS-variable tokens (`src/styles/tokens.css`).
- Search: Fuse.js with synonym expansion (`src/lib/search.ts`). Zero results show related topics; it never generates an answer.
- Progress: IndexedDB (`src/lib/storage.ts`), JSON export/import with schema versioning.
- PWA: `vite-plugin-pwa` (precache, offline fallback, update prompt).
- Accessibility: WCAG 2.2 AA target. Skip link, landmarks, visible focus, 44 px+ touch targets, icon + text for every status, live regions for quiz feedback and search counts, reduced-motion support, stacked tables on phones.

QA in this build: unit tests pass (21), and the responsive script reported no horizontal overflow, no console errors, and working search, visit-prep, quiz, keyboard and progress flows at 320, 390, 768, 1024, 1440 and 1920 px.
