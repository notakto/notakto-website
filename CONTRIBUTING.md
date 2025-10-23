# 🤝 Contributing to Notakto

Welcome, and thank you for contributing to **Notakto**. Notakto is a nostalgic, strategy-focused variant of tic-tac-toe with multiplayer, AI, and an in-game economy.

If this is your first time contributing to an open source project, see [Your First Pull Request][1].

## 🛠️ Development Setup

Assuming you have cloned the repository, follow these steps to set up your development environment:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation)

### Quick Start

**Install the Dependencies**

```bash
pnpm install:all 
```

**One command to start everything:**

```bash
pnpm dev:local
```

This automatically:
- Installs all dependencies for both main app and socket server
- Starts Next.js development server (http://localhost:3000)
- Starts Socket.IO server (http://localhost:8000)
- Enables hot reload for both servers

**Alternative commands:**

```bash
# Start only Next.js app
pnpm dev
```

> If you're working on **Live Match** features, run the Socket.IO server separately:

```bash
cd notakto-socket-server && pnpm start
```

## 🧪 Testing

We use **Jest** and **React Testing Library**.

```bash
# Run all tests
pnpm test

# Check coverage
pnpm test -- --coverage

# Lint code
pnpm lint
```

---

## 🔄 Pull Request Process

This repository uses the [GitHub flow][2] workflow. It uses [forks][3] and [branches][4] for an easy-to-follow collaborating experience.

1. Ask a repository maintainer to assign you to an issue. The issue can be an existing one, or you can create a new issue to address your proposed changes.
1. Make all changes to a `feature` branch in your forked repository.
1. Update the `README.md` file or appropriate files in the `docs` folder with your change's details.
1. Create a pull request with a description of what you changed and why you changed it.
1. After a reviewer approves and merges your pull request, delete the feature branch from this repository.

Always run the project's automated tests and check your changes in the app before you create a pull request.

### Quality Assurance

Before creating a pull request, ensure your changes meet our quality standards:

```bash
# Run automated tests
pnpm test

# Check code formatting and style
pnpm lint

# Verify the application runs correctly
pnpm dev:local
```

All tests must pass and the application must run without errors before you create a pull request.

### Docker Testing (Optional)

To test your changes in a production-like environment:

1. Install [Docker Desktop][11] and start the Docker Engine.
2. Build and run the application:

    ```bash
    docker-compose up --build
    ```

This builds both the web frontend and socket server, then starts the services on ports `3000` and `8000` respectively.

## 📦 Project Structure Overview

The project follows a modern Next.js architecture:

```text
src/
├── app/                   # Next.js route-based pages (vsComputer, vsPlayer, liveMatch)
├── modals/                # Modal components for UI flows
├── services/              # Core logic, AI engine, Zustand store, Firebase, etc.
notakto-socket-server/
├── livematch.js           # Socket.IO live multiplayer server (Node.js)
```

## 💡 Contribution Ideas

You can help in many ways:

* :books: Improve documentation
* :brain: Optimize AI or game logic
* :speech_balloon: Enhance UI/UX (modals, layout, gameboard)
* :test_tube: Write or improve test coverage
* :bug: Fix bugs or handle edge cases

Check the [issues][9] tab and milestones for open tasks.

## 🧹 Code Style & Guidelines

Follow these guidelines to maintain code quality and consistency:

### General Standards
* Format your code with **Prettier**
* Check your formatting with `pnpm lint` before committing
* Use **TypeScript** exclusively
* Avoid using the `any` type - prefer proper type definitions
* Write meaningful commit messages following conventional commit format

### Naming Conventions
* Use `camelCase` for variables and functions
* Use `PascalCase` for components and types
* Use `UPPER_SNAKE_CASE` for constants
* Use descriptive names that explain purpose

### Code Organization
* Favor functional components with hooks over class components
* Keep logic modular and reusable - see the `services/` folder structure
* Separate concerns: UI components, business logic, and data management
* Use custom hooks for reusable stateful logic

### State Management
* Use separate Zustand stores for different domains (coins, XP, player, game state)
* Reuse logic from `services/logic.ts` and `ai.ts` wherever possible
* Keep Firebase operations centralized in `services/firebase.ts`

### Testing
* Write unit tests for utility functions and business logic
* Write integration tests for complex user flows
* Maintain test coverage above 80%
* Mock external dependencies in tests

## 🙋 We're Happy to Help

Don't hesitate to ask questions, whether you need help setting up, understanding a file, raising an issue, or fixing a bug. You're absolutely welcome to reach out.

> **Note:** We don't expect you to understand everything perfectly. In fact, your questions help us improve the project and documentation.

You're always welcome to:
* Open a draft PR early and ask for feedback
* Comment on issues for clarification
* Ask for help with setup or technical issues
* Request code reviews for learning purposes
* Suggest improvements to our processes

If something is confusing, that's valuable feedback - feel free to open a discussion or comment anywhere.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

Thanks again for being part of Notakto! 🎮

[1]: ./FIRST_PR.md
[2]: https://docs.github.com/en/get-started/using-github/github-flow
[3]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks
[4]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches
[5]: ./package.json
[6]: https://localhost:3000
[7]: https://jestjs.io/
[8]: https://testing-library.com/docs/react-testing-library/intro/
[9]: https://github.com/rakshitg600/notakto-website/issues
[10]: https://github.com/Rakshitg600/notakto-website/issues/13
[11]: https://docs.docker.com/desktop/

