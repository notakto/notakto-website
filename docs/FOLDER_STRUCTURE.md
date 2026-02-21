# Project structure

The project's `src` folder contains the following modules:

```text
src/
├── app/
│   ├── api/
│   │   ├── create-payment/
│   │   │   └── route.ts
│   │   └── order-status/[id]/
│   │       └── route.ts
│   ├── vsComputer/
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   └── page.tsx
│   ├── vsPlayer/
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── Menu.tsx
│   └── page.tsx
├── modals/
│   ├── BoardConfigModal.tsx
│   ├── DifficultyModal.tsx
│   ├── PlayerNamesModal.tsx
│   ├── TutorialModal.tsx
│   └── WinnerModal.tsx
|── services/
    ├── ai.ts
    ├── economyUtils.ts
    ├── firebase.ts
    ├── logic.ts
    ├── sounds.ts
    ├── store.ts
    └── types.ts
```
