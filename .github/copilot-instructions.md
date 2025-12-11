# kiex-status Copilot Instructions

You are working on `kiex-status`, a geometric status bar built with **AGS (Aylur's GTK Shell)**, **GJS (GNOME JavaScript)**, and **GTK3**.

---

## 🏗 Git Workflow & Issue-Driven Hierarchy

This repository implements an **Issue-Driven Hierarchy** workflow. All development is driven by GitHub Issues and automated workflows.

### Hierarchical Branching Model

The codebase follows a strict hierarchical branching model:
`Main` ← `Task` ← `Feature` ← `Bug` ← `Hotfix`

- **Main**: Stable production code
- **Task**: Major units of work (branches from main, merges to main)
- **Feature**: Sub-components of a Task (branches from task, merges to task)
- **Bug**: Fixes for a Feature (branches from feature/task, merges to parent)
- **Hotfix**: Urgent fixes (branches from bug/main, merges to parent)

### Starting Work

**Preferred: Issue-Driven Workflow**

Open a GitHub Issue with the appropriate label:

- **Task**: New major unit of work. PR receives `implementation` label.
- **Feature**: References a **Parent Task Issue Number**. PR receives `addition` label.
- **Bug**: References a **Parent Issue Number**. PR receives `fix` label.
- **Hotfix**: References a **Parent Issue Number**. PR receives `fix` label.

Workflows automatically create the branch and PR with correct labels.

**Alternative: Manual Branch Creation**

For rapid development, create branches manually: `<type>/<descriptive-slug>`

Then:

1. Create GitHub issue describing the work
2. Create PR to appropriate parent branch
3. Add correct label (`implementation`, `addition`, or `fix`)
4. Reference issue: `Closes #<issue-number>`

### Branch Naming (Automated)

- Task: `task/<issue-id>-<slug>` → PR labeled `implementation`
- Feature: `feature/<issue-id>-<slug>` → PR labeled `addition`
- Bug: `bug/<issue-id>-<slug>` → PR labeled `fix`
- Hotfix: `hotfix/<issue-id>-<slug>` → PR labeled `fix`

### Versioning: Major.Task.Feature.Bug[a-z]

4-digit versioning with optional hotfix letter (e.g., `0.1.2.1` or `0.1.3.5b`)

**Automatic Version Bumping via PR Merges:**

- **Task → Main**: Bumps 2nd digit (e.g., `0.1.0.0` → `0.2.0.0`)
- **Feature → Task**: Bumps 3rd digit (e.g., `0.1.0.0` → `0.1.1.0`)
- **Bug → Feature/Task**: Bumps 4th digit (e.g., `0.1.0.0` → `0.1.0.1`)
- **Hotfix → Bug**: Bumps letter (e.g., `0.1.0.1` → `0.1.0.1a`)

**Direct Push to Main (Rare):**

Use semantic commit prefixes:

- `task:` - Bumps 2nd digit
- `feat:` - Bumps 3rd digit
- `bug:` - Bumps 4th digit
- `hotfix:` - Bumps letter suffix

### Critical Workflow Files

- `VERSION`: Source of truth for current version
- `package.json`: Synced with `VERSION` automatically
- `.github/workflows/`: Branch creation and version bumping logic
- `.github/ISSUE_TEMPLATE/`: Templates for automation

### AI Agent Guidelines

- **Context**: Check `VERSION` and active branch name for hierarchy level
- **Action**: Guide users to open issues rather than manual `git checkout -b`
- **Debugging**: Check `.github/workflows` for failures. Common issue: Missing "Parent Issue Number"

---

## Core Architecture: The "Base Tile" System

The project implements a unique "interlocking tile" visual system using Cairo drawing.

- **Concept**: The bar is composed of independent modules, each drawn as a sequence of interlocking trapezoids.
- **Parity & Offset**:
  - Parity is **local to the module**, not global to the bar.
  - Modules accept an `offset` (or `startParity`) parameter to determine their starting shape.
  - **Offset 0 (Even)**: Starts with Upright Trapezoid (`/ \`).
  - **Offset 1 (Odd)**: Starts with Inverted Trapezoid (`\ /`).
  - _Example_: Two adjacent 2-unit modules can both be configured to start with an Upright trapezoid.
- **Modules**: Widgets consume $N$ "units" of space.
  - A 2-unit module with `offset: 0` draws: Upright (`/ \`) -> Inverted (`\ /`).

## Directory Structure & Key Files

- `config.js`: **Entry Point**. Exports the AGS configuration object.
- `lib/drawing.js`: **Critical**. Handles all Cairo drawing logic. Defines `TILE_HEIGHT`, `TILE_WIDTH`, and `SLANT`.
  - **Best Practice**: Keep drawing functions pure and well-documented. Use helpers like `drawTrapezoid(cr, x, y, isUpright)`.
- `lib/tile.js`: Component wrapper that applies the geometric shape to content.
- `modules/*.js`: Individual status bar widgets (Clock, Workspaces).
- `style.scss`: SCSS entry point for GTK styling.

## Development Patterns

### 1. Creating Modules

- Modules should be wrapped in the `Tile` component from `lib/tile.js`.
- Define:
  - `units`: Width in base tiles.
  - `offset`: Starting parity (0 or 1).
- Content inside the tile must respect the trapezoidal boundaries (avoid placing text in the slanted edges).

### TypeScript Guidelines

- **Type Safety**: Prefer specific types over `any` when practical.
- **`any` is acceptable** in the following cases:
  - **GTK/AGS Widget Interop**: When dealing with AGS widget children, GTK widget properties, or Cairo contexts where the framework's type system is incomplete or overly complex.
  - **Dynamic Widget Trees**: For `children` props that accept mixed GTK widgets, TSX elements, or dynamic content.
  - **Third-party Library Gaps**: When AGS/GTK type definitions are incomplete or incorrect.
- **When to avoid `any`**:
  - Internal application logic and business code.
  - Data structures and models.
  - Function parameters with known types.
- Use explicit return types for exported functions to maintain type safety at API boundaries.

### 2. Cairo Drawing (`lib/drawing.ts`)

- Use `Cairo.Context` for custom drawing.
- Shapes are calculated dynamically based on `units` and `offset`.
- **Do not hardcode pixel values** inside modules; use the constants exported from `drawing.js`.
- Since Cairo can be complex, prioritize readability and modularity in drawing code.

### 3. AGS & GJS Specifics

- **Reactivity**: Use `Variable()` for state (e.g., `const time = Variable('', { poll: [1000, 'date'] })`).
- **Widgets**: Import from `resource:///com/github/Aylur/ags/widget.js` or the global `Widget`.
- **Async**: Use `Utils.execAsync([])` for shell commands. Avoid blocking calls.

## Style Guidelines

- Use **SCSS** for styling.
- Class names should follow kebab-case (e.g., `.clock-widget`).
- The geometric background is drawn via Cairo, but colors/fonts are handled in CSS.

## Build & Run

- Run with: `ags -c /absolute/path/to/config.js`
- Reload config: `ags -q; ags -c ...` or use the AGS inspector.

## Git Workflow & Versioning

- **Versioning**: 4-digit system (`Major.Task.Feature.Bug[a-z]`) stored in `VERSION`.
- **Branches**:
  - `main`: Stable development branch (PR target for tasks).
  - `release`: Production branch (optional, for production releases).
  - `task/*`: Major units of work (branches from main, merges to main).
  - `feature/*`: Sub-components of tasks (branches from task/_, merges to task/_).
  - `bug/*`: Bug fixes (branches from feature/_ or task/_, merges to parent).
  - `hotfix/*`: Urgent fixes (branches from bug/\* or main, merges to parent).
- **Release Process** (when using release branch):
  1. PR `main` -> `release`.
  2. Merge triggers automatic version bump (Major digit) and GitHub Release creation.
  3. For projects without a release branch, tags can be created directly on `main`.
