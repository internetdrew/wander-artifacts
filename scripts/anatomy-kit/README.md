# Anatomy geometry kit

Build-time copies from the installed Anatomy skill at
`/Users/internetdrew/.agents/skills/anatomy/kit`.

The bell builder uses `iso-kit.mjs` and `lathe.mjs` for projected geometry and
`audit.mjs` (which imports `tube.mjs`) for geometric validation. Keep these
upstream modules together when updating. They are excluded from application
linting; generated browser geometry lives in `src/bell/geometry.json`.
