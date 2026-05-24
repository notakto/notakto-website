# Project structure

The `src` folder uses a custom Feature Slicing Design layout:

```text
src/
├── app/
│   ├── api/                 # Next.js route handlers
│   ├── downloads/           # Thin App Router route
│   ├── liveMatch/           # Thin WIP route
│   ├── vsComputer/          # Thin App Router route
│   ├── vsPlayer/            # Thin App Router route
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── widgets/                 # Visible UI surfaces
│   ├── app-shell/
│   ├── downloads-platform-list/
│   ├── game-screen/
│   ├── global-modal-layer/
│   ├── home-menu/
│   ├── live-match/
│   ├── modals/
│   ├── not-found-surface/
│   ├── sidebar-navigation/
│   ├── splash-screen/
│   ├── toast-surface/
│   └── ui/
├── features/                # Workflows, side effects, stores, mutations
│   ├── app-state/
│   ├── authenticate-user/
│   ├── backend-game/
│   ├── computer-match/
│   ├── dismiss-splash/
│   ├── initialize-client-session/
│   ├── local-match/
│   ├── manage-global-modal/
│   ├── manage-sidebar-state/
│   ├── navigate-game-mode/
│   ├── payment/
│   ├── play-game-audio/
│   ├── show-toast-with-cooldown/
│   └── use-keyboard-shortcuts/
├── entities/                # Domain types, API schemas, rules, static models
│   ├── download/
│   ├── game/
│   └── shortcut/
└── shared/                  # Generic reusable UI primitives, styles, utilities
    ├── lib/
    ├── styles/
    └── ui/
```

`app` composes routes only. `widgets` may import from `features`, `entities`,
and `shared`; `features` may import from `entities` and `shared`; `entities`
may import only from other entities or generic dependencies; `shared` stays
Notakto-agnostic.
