# Mohiuddin Mehedi — Portfolio

Personal portfolio built with **Next.js 16** (App Router, Cache Components), **Tailwind CSS 4**, **Motion** and **MongoDB**, with a password-protected admin panel at `/admin` for editing everything live.

## Features

- Public site with hero, about, experience timeline, projects, research papers, skills and contact form
- Admin panel (`/admin`) with:
  - Profile & skills editor (name, intro, bio, stats, social links, skill groups)
  - Projects, Experience and Research editors: add, edit, delete and reorder
  - Inbox for contact-form messages
- Every save goes live right away: the public page is cached and prerendered, and each admin save expires that cache with `updateTag`
- Sessions are signed JWTs in an httpOnly cookie. `proxy.ts` gates `/admin`, and every server action checks the session again
- If no database is configured, the site falls back to the starter content in `src/lib/seed.ts`

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the panel.
On first login, click **Load starter content** on the dashboard to copy the starter content into your database, then edit it.

### Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `ADMIN_EMAIL` | yes | Email used to log in to `/admin` |
| `ADMIN_PASSWORD` | yes | Password for `/admin` (use a long random one) |
| `SESSION_SECRET` | yes | 32+ random characters: `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | recommended | e.g. `https://mmehedi.me` (used for SEO metadata) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | optional | Sends you an email for each contact-form message via [Resend](https://resend.com) |

### MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com.
2. Under **Database Access**, add a database user.
3. Under **Network Access**, allow `0.0.0.0/0`. Vercel's IP addresses change, so you can't allowlist specific ones.
4. Go to **Connect → Drivers** and copy the connection string into `MONGODB_URI`. Add a database name such as `/portfolio` before the `?`.

## Deploy to Vercel

1. Push this repo to GitHub and import it at https://vercel.com/new.
2. Add the environment variables above under **Settings → Environment Variables**.
3. Deploy. The build reads the database to prerender the homepage, so add `MONGODB_URI` before the first deploy.

## Images & files

Image and résumé fields take URLs. You can either:
- put files in `public/` (e.g. `public/images/project.png`) and reference them as `/images/project.png`, or
- paste any hosted image URL (GitHub, Cloudinary, Imgur, …).

## Project structure

```
src/
  app/
    page.tsx                 public homepage
    admin/(auth)/login       login page
    admin/(panel)/…          dashboard, profile, projects, experience, publications, messages
    actions/                 server actions (auth, admin CRUD, contact form)
  components/site/           public sections
  components/admin/          admin UI (generic collection editor, profile form, inbox)
  lib/
    collections.ts           field definitions for projects / experience / publications
    data.ts                  cached public read + admin reads
    models.ts                Mongoose models
    seed.ts                  starter content
  proxy.ts                   /admin route guard
```

To add a field to projects, jobs or papers, add it to `src/lib/collections.ts`, `src/lib/types.ts` and `src/lib/models.ts`. The admin form picks it up automatically.
