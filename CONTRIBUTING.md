# Contributing to Probe Browser 🚀

Thank you for your interest in contributing to Probe Browser! We welcome contributions from developers of all skill levels.

## 🎃 Hacktoberfest 2025

We're participating in Hacktoberfest! Check out [HACKTOBERFEST_ISSUES.md](./HACKTOBERFEST_ISSUES.md) for a curated list of issues perfect for Hacktoberfest contributions.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Issue Labels](#issue-labels)

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/probe.git
   cd probe
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/mrgear111/probe.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MySQL (v8 or higher)
- Git

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MySQL database:
   - Create a database named `probe_browser`
   - Default password in code is `12345678` (you can change in `src/main/database.ts`)

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

### Development Mode

For faster development with hot reload:

```bash
npm run dev
```

## 📁 Project Structure

```
probe/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main window & IPC handlers
│   │   ├── preload.ts  # Preload script (IPC bridge)
│   │   └── database.ts # MySQL database manager
│   ├── renderer/       # React UI
│   │   ├── App.tsx     # Root component
│   │   ├── components/ # React components
│   │   └── styles.css  # Application styles
│   └── types/          # TypeScript type definitions
├── dist/               # Compiled output
├── webpack.*.config.js # Webpack configurations
└── package.json        # Dependencies & scripts
```

## 🔧 Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `style/` - UI/styling changes

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Build the project
npm run build

# Run the application
npm start

# Test thoroughly:
# - Test in both windowed and fullscreen modes
# - Test on your platform (macOS/Windows/Linux)
# - Test all affected features
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message conventions:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - UI/styling changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## 🔀 Pull Request Process

1. **Update your fork** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what you changed and why
   - Reference any related issues (#issue-number)
   - Screenshots/GIFs if UI changes

3. **PR Title Format**:
   ```
   [Type] Short description
   ```
   Examples:
   - `[Feature] Add favicon display in tabs`
   - `[Fix] Resolve traffic light visibility issue`
   - `[Docs] Update installation instructions`

4. **Wait for Review**:
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged!

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Use **functional components** with hooks in React
- Use **async/await** instead of promises when possible
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Keep functions **small and focused**

Example:
```typescript
/**
 * Creates a new browser tab with the specified URL
 * @param url - The URL to load in the new tab
 * @returns The ID of the newly created tab
 */
function createNewTab(url: string = 'https://www.google.com'): number {
  // Implementation
}
```

### React Components

- One component per file
- Use functional components with hooks
- Props interface should be clearly defined
- Use descriptive prop names

Example:
```typescript
interface TabBarProps {
  tabs: Tab[];
  onNewTab: () => void;
  onCloseTab: (tabId: number) => void;
  isMaximized: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onNewTab, onCloseTab, isMaximized }) => {
  // Component implementation
};
```

### CSS

- Use **Chrome dark theme colors**:
  - Background: `#202124`
  - Surface: `#292a2d`
  - Input: `#303134`
  - Accent: `#8ab4f8`
  - Text: `#e8eaed`
- Use **descriptive class names**
- Keep styles **organized by component**
- Use **flexbox** for layouts

## 🧪 Testing

Currently, we don't have automated tests, but:

1. **Manual Testing Checklist**:
   - [ ] Feature works as expected
   - [ ] No console errors
   - [ ] UI looks correct
   - [ ] Works in windowed mode
   - [ ] Works in fullscreen mode
   - [ ] No performance issues
   - [ ] No memory leaks

2. **Future Testing** (Good contribution opportunity!):
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Spectron

## 🏷️ Issue Labels

- 🟢 `good-first-issue` - Perfect for newcomers
- 🔵 `hacktoberfest` - Eligible for Hacktoberfest
- 🟡 `documentation` - Documentation improvements
- 🟠 `enhancement` - New features or improvements
- 🔴 `bug` - Bug fixes needed
- 🟣 `advanced` - Requires advanced skills
- ⚪ `help-wanted` - Need community help

## ❓ Questions?

- **General Questions**: Open a [Discussion](https://github.com/mrgear111/probe/discussions)
- **Bug Reports**: Open a [Bug Report Issue](https://github.com/mrgear111/probe/issues/new?template=bug_report.md)
- **Feature Requests**: Open a [Feature Request Issue](https://github.com/mrgear111/probe/issues/new?template=feature_request.md)
- **Hacktoberfest**: Check [HACKTOBERFEST_ISSUES.md](./HACKTOBERFEST_ISSUES.md)

## 🎉 Recognition

All contributors will be recognized in our README and release notes!

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Probe Browser!** 🙏

Together, we're building an awesome open-source browser! 🌟
