# 🤝 Contributing to Notakto

Welcome, and thank you for contributing to **Notakto**, a strategy-focused variant of tic-tac-toe with multiplayer, AI, and an in-game economy.

This document focuses on **project-specific contribution rules and workflows**. For general open-source contribution best practices, see [Google’s Open Source Guide](https://opensource.guide/how-to-contribute/).

---

## 🛠️ Development Setup

1. **Clone the repository**
2. **Install prerequisites**:
   - [Node.js](https://nodejs.org/) v18+
   - [pnpm](https://pnpm.io/installation)
3. **Install dependencies and start development servers**:

```bash
pnpm install:all
pnpm dev:local
```

- Starts Next.js app on [http://localhost:3000](http://localhost:3000)
- Starts Socket.IO server on port 8000
- Hot reload enabled for both servers

**Alternative commands**:

```bash
# Only Next.js app
pnpm dev

# Only Socket.IO server for Live Match features
cd notakto-socket-server && pnpm start
```

---

## 🧪 Testing

- Run tests: `pnpm test`
- Check coverage: `pnpm test -- --coverage`
- Lint code: `pnpm lint`

---

## 🔄 Pull Request Process

1. Ask a maintainer to assign you to an issue (or create a new issue if needed).  
2. Make changes in a `feature` branch of your fork.  
3. Update `README.md` or `docs` if relevant.  
4. Open a pull request with a clear description of **what changed and why**.  
5. After approval and merge, delete your feature branch.

> Always run automated tests and verify the app before opening a PR.

---

## 💡 Contribution Ideas

- Improve documentation
- Optimize AI or game logic
- Enhance UI/UX (modals, layout, gameboard)
- Write or improve tests
- Fix bugs or handle edge cases

Check the [issues](https://github.com/rakshitg600/notakto-website/issues) tab for open tasks.

---

## 🧹 Project-Specific Code Guidelines

- Use **TypeScript** exclusively.
- Follow **camelCase** for variables/functions, **PascalCase** for components/types, **UPPER_SNAKE_CASE** for constants.
- Use functional components and hooks.
- Modularize logic in `services/`.
- Keep state management organized with separate Zustand stores.

**Testing Guidelines**:

- Unit tests for utilities and business logic
- Integration tests for user flows
- Mock external dependencies
- Maintain 80%+ coverage

---

## 🙋 Need Help?

- Open a draft PR early for feedback
- Comment on issues if unclear
- Request code reviews for learning
- Suggest process or documentation improvements

Your questions help improve Notakto!  

---

## 📚 References for General Practices

- [Google Open Source Guide](https://opensource.guide/how-to-contribute/)
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
- [Contributing to Open Source](https://opensource.guide/)

---

Thanks for contributing! 🎮
