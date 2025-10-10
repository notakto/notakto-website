# Contributing to Notakto

Thank you for contributing to Notakto! This guide covers project-specific setup, workflows, and standards based on feedback from previous pull requests.

**New to open source?** See [Google's Open Source Contributing Guide](https://opensource.google/documentation/reference/contributing) and [GitHub's How to Contribute](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project).

## Getting Started

### Prerequisites

- Node.js v18+
- pnpm ([installation guide](https://pnpm.io/installation))

### Local Development

```bash
# Install dependencies
pnpm install:all

# Start everything (Next.js + Socket.IO server)
pnpm dev:local
```

This runs:
- Next.js app on `http://localhost:3000`
- Socket.IO server on `http://localhost:8000`

**Working on Live Match features only?**

```bash
cd notakto-socket-server && pnpm start
```

## Project-Specific Standards

These guidelines are based on actual feedback from merged and reviewed PRs. Following them will help your PR get approved faster.

### PR Title & Description

#### Write descriptive PR titles that match what you actually changed
- ❌ **Bad**: "implemented queue customHook" (describes generic implementation, not the actual changes)
- ❌ **Bad**: "Ctrehan/96.2" (just branch name + issue number)
- ❌ **Bad**: "db-to-server" (too terse)
- ❌ **Bad**: "test solution of PR-166" (references ticket, not change)
- ✅ **Good**: "Implement custom toast hook and toast store for toast management"
- ✅ **Good**: "Refactor BoardConfigModal to use semantic HTML tags and ARIA roles"
- ✅ **Good**: "Move database operations to server-side REST API module"
- **Why**: Title must highlight the main purpose/enhancement to accurately reflect what changed

#### Ensure title matches the actual changeset
- If your PR adds a custom toast hook, toast store, and toast management logic, say that - don't just say "implemented queue customHook"
- The mismatch between generic titles and actual changes misleads reviewers about the primary purpose

#### Always include a PR description
- Briefly outline the purpose and key details of your changes
- Help reviewers understand what the PR addresses and why
- Example: "This PR adds rate limiting middleware to prevent API abuse during live matches"

### Workflow: Focus on One Issue at a Time

#### Don't work on multiple issues simultaneously
- Pick one issue, fix it with focus, then move to the next
- Close all PRs except the one you're actively working on
- Get yourself unassigned from issues you're not working on
- **Why**: Maintains quality and helps you complete work rather than starting many things

### PR Scope: Stay Focused

#### Don't include unrelated changes
- If the issue asks for semantic HTML improvements, don't add type guards or whitespace-only edits in unrelated files
- Remove or defer changes that aren't specified in the linked issue
- Keep PRs focused exclusively on what the issue specifies
- **Why**: Mixing concerns makes review harder and increases chance of bugs

#### Clean up your git diff before submitting
- Review your git diff carefully and remove all irrelevant changes
- Common issues: whitespace-only changes, unrelated file modifications, debugging code
- **Why**: Makes review easier and keeps git history clean

### Firebase Configuration

#### Use correct Next.js environment variable prefix
- ❌ **Wrong**: `FIREBASE_API_KEY` (unprefixed)
- ✅ **Right**: `NEXT_PUBLIC_FIREBASE_API_KEY` (prefixed)
- **Why**: Next.js only exposes env vars with `NEXT_PUBLIC_` prefix to the frontend; unprefixed vars are `undefined` at runtime and break Firebase initialization

#### Don't make optional fields mandatory
- `measurementId` is optional (only for Analytics)
- Forcing all Firebase env vars to be required crashes the app in dev/preview when Analytics isn't configured

#### Keep documentation consistent
- Different docs should not contradict each other about which Firebase auth providers to enable
- Update all related docs and screenshots together before merge

#### Scope setup instructions clearly
- Mark advanced/optional steps as "(Optional)" with context
- Example: Firebase Service Account setup is optional (only for Admin SDK/server scripts)
- Don't mention unrelated APIs (like Coinbase) in Firebase setup docs

### Semantic HTML & Accessibility

#### Actually implement what the issue requests
- If an issue asks for semantic tag replacements, the diff should show `<div>` → `<dialog>`, `<span>` → `<header>`, etc.
- Don't just add type guards without doing the semantic refactoring

#### Modal dialogs require proper ARIA attributes
- Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="[id]"` to modal containers
- **Why**: Screen reader users won't get proper modal context without these

### UI Component Patterns

#### Don't add guard functions without triggers
- If you add a check like `canShowToast()`, ensure you also call the corresponding trigger like `triggerToastCooldown()`
- **Why**: Creates dead code and confuses maintainers about intended behavior

#### Always restore state in useEffect cleanup
- If you set `body.style.overflow = "hidden"` (for scroll lock), restore it in the cleanup function
- ❌ **Problem**: Setting `body.style.overflow` but not restoring it when component unmounts leaves the body locked
- ✅ **Solution**: Add cleanup that restores the original value or sets it back to `"auto"`
- **Pattern**: Store the original value, then restore it in the return function of `useEffect`

### Web Audio API

#### Always clean up audio nodes
- Creating hover sound nodes without cleanup causes memory leaks
- Disconnect nodes when done (add cleanup in `useEffect` return or after use)
- Route gain through shared variables so volume APIs affect the synthetic audio path

### Documentation Coverage

**Maintain 80%+ docstring coverage**
- Run `@coderabbitai generate docstrings` to improve coverage before submitting

### CodeRabbit Suggestions

The project uses CodeRabbit AI for automated PR reviews. These suggestions are helpful but not mandatory:
- Acknowledge good suggestions and check if they're helpful
- You don't need to implement every suggestion
- Use your judgment on what improves the code

## File Structure

```text
src/
├── app/              # Next.js pages (vsComputer, vsPlayer, liveMatch)
├── modals/           # Modal components
├── services/         # Business logic, AI, stores, Firebase
│   ├── logic.ts      # Core game rules
│   ├── ai.ts         # AI decision engine
│   ├── firebase.ts   # All Firebase operations
│   └── stores/       # Zustand state stores

notakto-socket-server/
├── livematch.js      # Socket.IO multiplayer server
```

#### Where to put new code:
- Game logic → `services/logic.ts`
- AI improvements → `services/ai.ts`
- UI components → `app/` or `modals/`
- State management → `services/stores/`

## Before Submitting a PR

**Required checks:**
```bash
pnpm test          # All tests pass
pnpm dev:local     # App runs without errors
```

## Docker Testing (Optional)

Test in a production-like environment:

```bash
docker-compose up --build
```

Requires [Docker Desktop](https://docs.docker.com/desktop/) with Docker Engine running.

## Need Help?

- Open a draft PR early for feedback
- Comment on issues for clarification
- Ask questions - they help us improve the docs

Your questions are valuable. Don't hesitate to reach out.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)

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
## 📚 Additional Resources
...
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [The Complete Guide to Readable Code][12]
...
[12]: https://fellow.ai/blog/the-complete-guide-to-readable-code/

Thanks for contributing to Notakto! 🎮