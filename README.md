# Wander x Andrew Rowley

A collection of thoughtful interfaces and playful interactions for Wander, designed and built by Andrew Rowley.

[View the project](https://wander-artifacts.vercel.app/)

- **Extended Stay** — Choose extra nights, review payment, and download an invoice.
- **Day to Night** — Explore [Watchmere](https://www.wander.com/property/wander-marthas-vineyard) through an interactive photo with a time-of-day slider.
- **Welcome Stack** — Guest essentials in a playful card stack, with Wi-Fi, arrival details, and animated amenity illustrations.

Built with React, TypeScript, Vite, Tailwind CSS, Base UI, and Motion. Includes keyboard navigation and reduced-motion support.

Each project has a notebook button beside its title with design notes.

## Development

```sh
npm install
npm run dev
```

```sh
npm run build   # Production build
npm run lint    # Lint checks
```

The production build prerenders the initial page into HTML, then hydrates its
interactions in the browser. The full stay-extension flow loads when exploring
dates, and the Welcome Stack loads near the viewport. Use `npm run preview` to
check the production output locally.
