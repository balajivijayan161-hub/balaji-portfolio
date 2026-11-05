# Balaji Vijayan — Portfolio

Personal portfolio for Balaji Vijayan, an Electronics and Communication Engineering student graduating in 2027. The site is a static React app (Vite, Tailwind CSS, Framer Motion, Lucide) and can be deployed to Vercel or Netlify.

Every biography fact, project, skill, date, and link is in one file: [`src/data/portfolio.js`](src/data/portfolio.js). Components only render that file.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

The dev server listens on port **4321** (http://localhost:4321).

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` writes the static site to `dist/`.

## Project structure

```
public/
  resume.pdf                 Resume download
  favicon.svg                Tab icon
  og.png                     Social share image
  _redirects                 Netlify SPA fallback
  images/
    profile.jpg              Optional portrait (not included yet)
    projects/                Project photos and the ATM illustration
    certificates/            Optional certificate scans
    activities/<slug>/       Optional event photos
src/
  data/portfolio.js          All site content
  components/                Sections, nav, form, circuit background
  auth/                      Optional Supabase sign-in
  App.jsx
supabase/schema.sql          Visitor log, summary view, and RLS
vercel.json                  Vercel SPA fallback
```

## Update personal info

Edit `src/data/portfolio.js`.

- Name, title, about paragraph, email, and location are fields near the top and in `contact`.
- Skills are three arrays under `skills.groups` (`software`, `hardware`, `tools`). Add or remove a string. Do not add scores or bar percentages — the page does not render levels.
- Education, internships, certifications, and activities are arrays. Copy an existing object and change the fields.
- Projects are the `projects` array. Each item needs `title`, `summary`, `credit`, `tech`, `details` (paragraphs), `links` (use `[]` when there is no public URL), and `gallery`.
- The page title and meta description are `site.title` and `site.description`. `site.url` defaults to `https://balaji-vijayan.onrender.com` (no trailing slash). Change it if the live origin is different. The build writes `sitemap.xml`, `robots.txt`, the canonical link, and the absolute Open Graph image from that value. `robots.txt` disallows `/admin`, and that page sets `noindex, nofollow`. The sitemap lists only the public homepage.
- `profile.objective` is the hero career line. `profile.openToWork` shows or hides the badge; the badge text is `profile.openToWorkText`.
- Paste a Google Search Console token into `site.googleSiteVerification`, or set `VITE_GOOGLE_SITE_VERIFICATION`. That fills `<meta name="google-site-verification">`.
- Each project has an optional `github` string. Leave it empty when there is no repository. The ATM project is the one that has a URL.
- `about.languages` is optional. Leave it as `[]` and the About section stays as the biography paragraph. Add language names to show a Languages block.
- LeetCode solved counts are loaded in the browser for `leetcode.username`. They are not stored in this file.
- Social profiles are the `socials` array.

Restart `npm run dev` if it is already running. Vite reloads on save.

## Replace the resume

Replace `public/resume.pdf` with the new PDF. Keep the filename, or change `profile.resume.href` and `profile.resume.download` in `src/data/portfolio.js` to match the new file.

## Profile photo

`profile.photo.src` in `src/data/portfolio.js` is `null` until you add a portrait. The page shows the initials **BV** and does not request an image.

1. Save the photo, for example as `public/images/profile.jpg`.
2. Set `profile.photo.src` to `"/images/profile.jpg"` (or whatever path you used).
3. Reload.

Use a square image if you can. The frame crops with `object-cover`.

## Project images

Card and gallery images are listed on each project in `gallery`.

- The first gallery item is the card image.
- `src` is a public path such as `/images/projects/spectrum/prototype.webp`.
- `alt` and `caption` are required. `width` and `height` should match the file so the layout does not jump.
- The ATM card uses `public/images/projects/atm/cover.svg`, an illustration, not a screenshot of the app.

To add a photo, put the file in `public/images/projects/<project-id>/` and append an object to that project's `gallery`.

## Certificate images

Each entry in `certifications` has `image: null` until you add a scan.

1. Save a file under `public/images/certificates/`, for example `ccna.webp`.
2. Set `image` to `"/images/certificates/ccna.webp"` and adjust `imageAlt`.

If `image` is `null`, or the file fails to load, the site shows a text card with the issuer and name. It does not use a stock photo.

## Activity photos

Each activity has a `slug` and a `photos` array. The folder is `public/images/activities/<slug>/`.

Example, after you add files:

```js
{
  id: "ieee-upskill-2024",
  slug: "ieee-upskill-2024",
  title: "Coordinated IEEE UPSKILL Event 2024",
  icon: "users",
  photos: ["opening.webp", "group.webp"],
}
```

Those files must exist at:

```
public/images/activities/ieee-upskill-2024/opening.webp
public/images/activities/ieee-upskill-2024/group.webp
```

An empty `photos` array renders an icon card. Icons already used: `users`, `award`, `circuit`, `code`, `radio`. Any other value falls back to the award icon.

## Add a project or a skill

**Skill.** Add a string to the right group in `skills.groups`.

**Project.** Append an object to `projects` with the same fields as the existing ones. Put images in `public/images/projects/<id>/` and point `gallery[].src` at them. Leave `links` as `[]` unless you have a real URL. Set `credit` so team work is never presented as solo work.

## Contact form (Web3Forms)

The form validates name, email, and message in the browser and includes a honeypot field. It posts to Web3Forms only when an access key is present.

1. Create a free access key at [web3forms.com](https://web3forms.com).
2. Locally, copy `.env.example` to `.env` and set:

   ```
   VITE_WEB3FORMS_KEY=your_access_key
   ```

3. Restart the dev server. Vite only reads `VITE_` variables at startup.
4. On Vercel: Project → Settings → Environment Variables → add `VITE_WEB3FORMS_KEY`, then redeploy.
5. On Netlify: Site configuration → Environment variables → add `VITE_WEB3FORMS_KEY`, then trigger a new deploy.

If the key is missing, the form still validates, then opens a `mailto:` message to balajivijayan161@gmail.com. The page says so above the form.

Do not commit `.env`. It is gitignored. `.env.example` is the template and contains no key.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add `VITE_WEB3FORMS_KEY` if you want the form to send through Web3Forms. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` if you want visitor sign-in.
5. Deploy.
6. If the live origin is not `https://balaji-vijayan.onrender.com`, set `site.url` and redeploy so the canonical URL, sitemap, and Open Graph image match it.

`vercel.json` rewrites unknown paths to `index.html`, so a refresh does not return the host's default 404. `/admin` is a client-side route and stays available on refresh. Any other unknown path shows the in-site "Page not found" view.

## Deploy to Netlify

1. Push the repository.
2. In Netlify, **Add new site** → import the repository.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Add `VITE_WEB3FORMS_KEY` under environment variables if you want Web3Forms. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` if you want visitor sign-in.
5. Deploy.
6. If the live origin differs from `site.url`, update that field and redeploy, same as on Vercel.

`public/_redirects` is copied into `dist` and contains:

```
/*    /index.html   200
```

That is the SPA fallback, including `/admin`. Existing files such as `resume.pdf` and images are still served directly.

## Deploy to Render

A Render static site does not use `vercel.json` or `public/_redirects`. This repo includes `render.yaml` so a refresh of `/admin` still loads the app.

1. In Render, **New** → **Blueprint**, and point it at this repository. Render reads `render.yaml`. Or create a **Static Site** by hand with:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
2. Add the same environment variables as on the other hosts if you want the contact form or sign-in: `VITE_WEB3FORMS_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. They are listed in `render.yaml` with `sync: false`, so you set the values in the Render dashboard. Do not commit them.
3. The blueprint rewrites `/*` to `/index.html`. Render still serves real files such as `/resume.pdf` and `/images/...` when they exist.
4. Deploy. `site.url` already points at `https://balaji-vijayan.onrender.com`. If Render assigns a different origin, update `site.url` and add that origin to the Supabase redirect URLs.

## Optional visitor sign-in (Supabase)

Sign-in is optional. The portfolio stays fully readable without an account. If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, the Sign in button is hidden and `/admin` explains how to connect Supabase. The site still builds and runs.

Signing in (Google or an email link) stores the visitor's name, email, and sign-in time so you can see who visited. Only a verified session for `balajivijayan161@gmail.com` can open the list at `/admin` (`email_verified` is true, or `email_confirmed_at` is set). That allow-list is the SQL function `public.admin_email()` in `supabase/schema.sql`. Row Level Security enforces it: a signed-in person can insert only their own row, at most once every 10 minutes, and only the verified admin email can read rows.

Use the **anon public** key. Do not put the Supabase **service_role** key in any `VITE_` variable. Vite ships those values in the browser bundle.

### 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project (the free tier is enough).
2. Wait until the database is ready.
3. Open **Project Settings → API**.
4. Copy the **Project URL** and the **anon public** key.

### 2. Run the schema

1. Open **SQL Editor → New query**.
2. Paste the full contents of `supabase/schema.sql`.
3. Run it. You should see `visitor_logins` under **Table Editor** and `visitor_summary` under views.

The script creates:

- `visitor_logins` — one row per sign-in (`id`, `user_id`, `name`, `email`, `avatar_url`, `provider`, `signed_in_at`)
- `visitor_summary` — one row per person (first seen, last seen, login count)
- `log_visit()` — the function the site calls after sign-in
- RLS policies, plus `admin_email()` and `current_user_is_admin()`

To use a different admin account later, change the email inside `admin_email()` and run that function again. Changing only the React code does not grant access.

### 3. Enable email magic links

1. Open **Authentication → Providers → Email** and enable it.
2. Leave magic-link / OTP sign-in available. The site calls `signInWithOtp`.
3. You can leave "Confirm email" on. The link in the message is the sign-in.

### 4. Enable Google

In Google Cloud Console:

1. Create or select a project.
2. **APIs & Services → OAuth consent screen**. Choose External, fill the app name and your email, and add `balajivijayan161@gmail.com` as a test user if the app stays in testing.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**. Application type: **Web application**.
4. Authorized JavaScript origins:
   - `http://localhost:4321`
   - `http://127.0.0.1:4321`
   - your production origin, for example `https://your-domain.example`
5. Authorized redirect URI (this is Supabase, not the portfolio):
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
6. Copy the client ID and client secret.

In Supabase:

1. **Authentication → Providers → Google**. Enable it and paste the client ID and secret.
2. Save.

### 5. Site URL and redirect URLs

**Authentication → URL Configuration**.

- Site URL: `http://localhost:4321` while you are developing. When you deploy, change it to the production origin (no trailing slash), or keep production as the Site URL and allow localhost in the redirect list below.
- Redirect URLs (add each one):
  - `http://localhost:4321`
  - `http://127.0.0.1:4321`
  - `http://localhost:4321/**`
  - `http://127.0.0.1:4321/**`
  - `https://your-domain.example`
  - `https://your-domain.example/**`

The site sends people back to the page they started on (`/` or `/admin`).

### 6. Environment variables

Locally, copy `.env.example` to `.env` and set:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Restart `npm run dev`. Vite reads `VITE_` variables at startup.

On Vercel: **Project → Settings → Environment Variables**. Add both names, then redeploy.

On Netlify: **Site configuration → Environment variables**. Add both names, then trigger a new deploy.

### 7. View the visitor list

1. Open the site and choose **Sign in**.
2. Use Google or the email link with **balajivijayan161@gmail.com**. The note under the form tells visitors what is saved.
3. Go to `/admin` (or the **Visitors** link, which appears only for that account).
4. The table is newest first, with name, email, provider, last seen in IST, and how many times they signed in. The count above the table is unique visitors. Search filters the rows. **Export CSV** downloads the rows currently shown.
5. Any other account, or no account, sees "Not authorised". The database returns no rows to them even if the page is bypassed.

While `npm run dev` is running, these addresses preview the UI without a Supabase project. They are not in the production build:

- `http://localhost:4321/?preview=signin` — sign-in modal
- `http://localhost:4321/admin?preview=unauthorised` — not-authorised screen
- `http://localhost:4321/admin?preview=visitors` — mock table, labeled as mock data

## Accessibility and motion

The circuit background is a canvas. It follows the pointer and pauses when the tab is hidden. With `prefers-reduced-motion: reduce`, it draws one static frame and does not track the pointer. The typing effect shows the full title immediately, and smooth scrolling is turned off.
