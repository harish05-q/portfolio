# Harish Pal — Portfolio

A personal portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. First run needs internet access once to fetch the Google Fonts (Fraunces, Inter, JetBrains Mono) — normal for any Next.js project.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com/new) — zero config needed, it's a standard Next.js app.

## Editing content

Everything text-based — your name, bio, skills, projects, links, stats — lives in one place:

```
lib/data.ts
```

### Adding a project

Open `lib/data.ts` and add a new object to the `projects` array:

```ts
{
  slug: "your-project-slug",
  name: "Project Name",
  tagline: "One sentence on what it does.",
  problem: "What real problem it solves.",
  approach: ["Bullet on how you built it", "Another bullet"],
  stack: ["Tech", "Tech", "Tech"],
  links: [
    { label: "Live demo", href: "https://..." },
    { label: "Source", href: "https://github.com/..." },
  ],
  featured: true, // shows on homepage too; false keeps it on /projects only
}
```

It'll show up automatically on `/projects`, and on the homepage if `featured: true`.

### TODO before shipping

Search the repo for `TODO` to find each one:

- [ ] `profile.links.linkedin` in `lib/data.ts`: currently the placeholder `https://www.linkedin.com/in/YOUR-HANDLE`
- [ ] `profile.links.ssrn` in `lib/data.ts`: currently the generic `https://papers.ssrn.com/`; paste the direct URL of your paper
- [ ] R.AI source link in `lib/data.ts` (project `rai`): currently points at your GitHub profile, not the repo
- [ ] Double-check `public/resume.pdf` is your latest resume
- [ ] Check the `lib/data.ts` projects that came from your older site (PInSight, MarketIQ, EduSwap, Stock LSTM) still match your resume. The resume only lists R.AI and CodeAutopsy

## Structure

```
app/
  layout.tsx          # fonts, metadata, cursor, grain texture
  page.tsx            # home: the Journey + a screen-reader/SEO text copy
  (site)/             # classic multi-page version with Nav + Footer
    classic/ projects/ about/ contact/
  globals.css         # theme tokens (colors, type), journey styles
components/
  journey/
    Journey.tsx       # controller: keyboard, wheel, touch, transitions
    frames/           # one component per layer (Hero, Edge, Service, Agent,
                      #   Vector, Analysis, Incident, Response)
    TraceRail.tsx     # bottom progress/waterfall rail
    CommandPalette.tsx, ProjectDrawer.tsx, Backdrop.tsx, ui.tsx
  HeroScene.tsx, CustomCursor.tsx, Nav.tsx, Footer.tsx, ProjectCard.tsx, Reveal.tsx
lib/
  data.ts             # ALL editable content lives here
  journey.ts          # layer list, project search, embedding layout, incident log
public/
  resume.pdf
```

### Changing the journey

- Layer order, names and timings: `frames` in `lib/journey.ts` (and the matching list in `Journey.tsx`).
- Where each project sits on the vector map: `embeddingLayout` in `lib/journey.ts`.
- Search keywords per project: `keywords` / `synonyms` in `lib/journey.ts`.
- Career and achievements timeline: `incidentLog` in `lib/journey.ts`.
