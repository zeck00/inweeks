# Contributing to In Weeks

Thanks for your interest in contributing! This is a small open-source project and I welcome help.

## Quick start

```bash
git clone https://github.com/zeck00/inweeks.git
cd inweeks
npm install
npm run dev
```

App runs at http://localhost:5173.

## Project structure

```
src/
├── components/        # React components (CSS Modules)
│   ├── common/        # Button, Input, Modal, etc.
│   ├── Onboarding/    # 3-step setup flow
│   ├── Grid/          # Canvas-based week grid
│   ├── Chapters/      # Chapter management
│   ├── Stats/         # Stats bar
│   ├── ShareCard/     # PNG export
│   ├── Header/, Footer/, Landing/
├── hooks/             # Custom React hooks
├── utils/             # Date math, helpers
├── data/              # Country life expectancy, color presets
├── context/           # App state (Context + useReducer)
├── styles/            # Global tokens, reset, typography
└── types/             # TypeScript interfaces
```

## Style conventions

- **CSS Modules** only. No Tailwind, no global styles beyond `src/styles/`.
- **Design tokens** live in `src/styles/tokens.css`. Always reference them — never hardcode hex values in components.
- **Components are forwardRef + interface props**. See `Button` for the pattern.
- **No external UI libraries**. All components are custom.

## Pull request guidelines

1. **Open an issue first** if you're planning a non-trivial change.
2. **Keep PRs focused** — one feature or fix per PR.
3. **Run `npm run build`** locally to make sure TypeScript and Vite are happy.
4. **No new dependencies** without discussion.
5. **Match existing code style** — there's no formatter enforced; just look around.

## Good first issues

- Add more chapter color palettes (themed: pastels, warm, monochrome)
- Improve mobile touch interactions on the grid
- Add language localization (Spanish, French, Arabic)
- Country flag icons in the country picker
- Square + landscape share card formats

## Out of scope

This project is intentionally minimal:
- ❌ User accounts / authentication
- ❌ Backend / database
- ❌ Analytics or tracking
- ❌ Social features (likes, comments, etc.)
- ❌ Anything that breaks the "your data never leaves your device" promise

## Questions?

Open an issue or ping [@zeq_0](https://twitter.com/zeq_0) on Twitter/X.
