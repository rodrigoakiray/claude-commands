# Claude Commands

A mobile-first reference app for Claude Code: slash commands, CLI flags,
keyboard shortcuts, and hooks/permission-mode config — searchable and
filterable, optimized for iPhone and iPad mini.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All commands live in [`data/commands.ts`](./data/commands.ts) as a typed
array — there's no backend or database. To add or update an entry, edit that
file and run `npm run build` to verify.

## Deploy

Deployed on [Vercel](https://vercel.com); pushes to `main` build and deploy
automatically via the connected GitHub repository.
