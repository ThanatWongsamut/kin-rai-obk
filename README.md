# กินไรดี? @ OBK (Kin Rai Dee at One Bangkok)

A fun spinning wheel app to help you decide where to eat at [One Bangkok](https://www.onebangkok.com/).

## Features

- **62 restaurants** from Parade and The Storeys zones
- **Spinning wheel** with tick sound effects and smooth deceleration
- **Category filter** — Japanese, Korean, Thai, Western, Chinese, Coffee & Cafe, Desserts & Bakery (multi-select)
- **Price range filter** — $, $$, $$$, $$$$ (multi-select, cross-filtered with categories)
- **Bilingual UI** — Thai / English toggle
- **Result card** with restaurant image, cuisine, price, building & floor
- Built with Next.js, TypeScript, Tailwind CSS, and Kanit font

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Sources

Restaurant data sourced from:
- [One Bangkok Directory API](https://www.onebangkok.com/content/onebangkok_v2/en/directory/jcr:content/root/container/directory.model.json)
- [One Bangkok Restaurant Blog](https://www.onebangkok.com/th/blog/restaurants-at-one-bangkok/)

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS v4
- HTML5 Canvas (spinning wheel)
- Web Audio API (tick sounds)
- [Kanit](https://fonts.google.com/specimen/Kanit) font (Thai + Latin)
