# 🎉 Your First Pull Request

Welcome to **Notakto**! We're glad you're here and interested in contributing.

Whether you're fixing a bug, improving the UI, or adding a new feature—thank you for your time and interest!

## 🪜 Steps to Make Your First PR

This repository uses the [GitHub flow][1] workflow. It uses [forks][2] and [branches][3] for an easy-to-follow collaborating experience.

Follow these steps to use the GitHub flow workflow to make your first contribution.

### 1. Fork and Clone the Repository

Fork the repository to your personal GitHub account. Then, clone your forked repository to your computer. This copy is where you make your proposed changes.

1. Go to the [notakto-website][4] repository
2. Select **Fork**
3. Select **Create fork**
4. Clone your forked repository:

    ```bash
    git clone https://github.com/YOUR_USERNAME/notakto-website.git
    cd notakto-website
    ```

### 2. Create a Branch

Create a new branch for your new feature. A new branch keeps your changes separate from the "main" code in the `main` branch.

```bash
git checkout -b feature/MyNewFeature
```

### 3. Make Your Changes

Make your changes to the codebase. Focus on one specific improvement or fix.

**Tips for good changes:**
- Keep changes focused and small
- Follow the existing code style
- Test your changes thoroughly
- Make sure the app runs without errors

* Make sure your changes work. To test your changes, run the following commands: 

    ```bash
    pnpm test
    ```
### 4. Commit Your Changes

Commit your changes with a descriptive message:

```bash
git add .
git commit -m 'Add my new feature'
```


**Commit best practices:**
- Keep commits focused and meaningful
- Each commit should describe one change
- Use clear, descriptive commit messages
- Example: `Fix board reset bug` or `Add sound toggle button`

### 5. Push and Create Pull Request

1. Push your branch to your forked repository:

    ```bash
    git push -u origin feature/MyNewFeature
    ```

2. Go to the [notakto-website][4] repository
3. Select **Compare & pull request**
4. Add a description of your changes including:
   - A summary of what you changed
   - Why you made the change
   - Any issues your change fixes
5. Select **Create pull request**

A reviewer will review your pull request. If they approve it, they'll merge your changes into the project's `main` branch.

Congratulations, you've made your first contribution! 🎉

## 💬 Don't Hesitate to Ask

Don't worry if anything seems confusing as you're getting started. If you're stuck on something, just ask!

> **Note:** We don't expect you to understand everything perfectly. In fact, your questions help us improve the project.

You're always welcome to:
- Open a draft PR early and ask questions
- Comment on issues for clarification  
- Ask for help with setup or technical issues
- Clarify anything about the codebase

We're truly happy to help. Your interest means a lot! 😊

## 📚 Next Steps

For detailed development setup, testing, and contribution guidelines, see our [Contributing Guide][5].

Thanks again—and welcome aboard! 🚀

[1]: https://docs.github.com/en/get-started/using-github/github-flow
[2]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks
[3]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches
[4]: https://github.com/Rakshitg600/notakto-website
[5]: ./CONTRIBUTING.md
