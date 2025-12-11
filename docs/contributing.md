# Contributing Guide

This repository implements an **Issue-Driven Hierarchy** workflow. All development is driven by GitHub Issues and automated workflows.

## 🏗 Architecture & Hierarchy

The codebase follows a strict hierarchical branching model:
`Main` ← `Task` ← `Feature` ← `Bug` ← `Hotfix`

-   **Main**: Stable production code.
-   **Task**: Major units of work (merges to Main).
-   **Feature**: Sub-components of a Task (merges to Task).
-   **Bug**: Fixes for a Feature (merges to Feature).
-   **Hotfix**: Urgent fixes for a Bug (merges to Bug).

## 🚀 Developer Workflow

### 1. Starting Work

#### Option A: Issue-Driven (Recommended)

Open a GitHub Issue with the appropriate label:

-   **Task**: Starts a new major unit of work. PR receives `implementation` label.
-   **Feature**: Must reference a **Parent Task Issue Number**. PR receives `addition` label.
-   **Bug**: Must reference a **Parent Issue Number** (usually a Feature). PR receives `fix` label.
-   **Hotfix**: Must reference a **Parent Issue Number** (usually a Bug). PR receives `fix` label.

The automated workflows will automatically create the correctly named branch and pull request with the appropriate label.

#### Option B: Manual Branch Creation (Rapid Development)

For rapid development when there's no time to create an issue first:

```bash
# Follow the naming convention:
git checkout -b <type>/<descriptive-slug>

# Examples:
git checkout -b task/user-authentication
git checkout -b feature/login-form
git checkout -b bug/fix-validation-error
git checkout -b hotfix/patch-security-issue
```

**Important:** After creating your branch manually:

1. **Create a GitHub issue** describing the work
2. **Create a pull request** to the appropriate parent branch:
    - Task → `main`
    - Feature → parent task branch
    - Bug → parent feature/task branch
    - Hotfix → parent bug branch or `main`
3. **Add the appropriate label** to your PR:
    - `implementation` for tasks
    - `addition` for features
    - `fix` for bugs and hotfixes
4. **Reference the issue** in the PR description: `Closes #<issue-number>`

### 2. Branch Naming Convention (Automated)

-   Task: `task/<issue-id>-<slug>` → PR labeled `implementation`
-   Feature: `feature/<issue-id>-<slug>` → PR labeled `addition`
-   Bug: `bug/<issue-id>-<slug>` → PR labeled `fix`
-   Hotfix: `hotfix/<issue-id>-<slug>` → PR labeled `fix`

## 📦 Versioning System

The project uses a 4-digit versioning scheme with an optional alphabetical hotfix postfix: `Major.Task.Feature.Bug[a-z]` (e.g., `0.1.2.1` or `0.1.3.5b`).

### Automatic Version Bumping via PR Merges

-   **Task Merge** (to Main): Bumps 2nd digit (e.g., `0.2.0.0`).
-   **Feature Merge** (to Task): Bumps 3rd digit (e.g., `0.1.3.0`).
-   **Bug Merge** (to Feature): Bumps 4th digit (e.g., `0.1.2.2`).
-   **Hotfix Merge** (to Bug): Bumps hotfix letter alphabetically (e.g., `0.1.2.1` → `0.1.2.1a` → `0.1.2.1b`).

**Notes**:

-   Merging a Bug directly to a Task does _not_ trigger an automated version bump.
-   Hotfix letters increment alphabetically starting from 'a'.
-   Standard version bumps (Task, Feature, Bug) reset the hotfix letter.

### Direct Push Version Bumping (Use Sparingly)

⚠️ **WARNING**: Direct pushes to `main` should be **extremely rare**! The issue-driven PR workflow is the proper way to manage all changes for proper code review, traceability, and team collaboration.

If you must push directly to `main` (emergency hotfixes or administrative tasks only), you can trigger automatic version bumps using **semantic commit message prefixes**:

| Commit Prefix | Version Bump        | Example Change         |
| ------------- | ------------------- | ---------------------- |
| `task:`       | 2nd digit (Task)    | `0.1.x.x` → `0.2.0.0`  |
| `feat:`       | 3rd digit (Feature) | `0.1.2.x` → `0.1.3.0`  |
| `bug:`        | 4th digit (Bug)     | `0.1.2.1` → `0.1.2.2`  |
| `hotfix:`     | Letter suffix       | `0.1.2.1` → `0.1.2.1a` |

**Examples**:

```bash
# Emergency security patch
git commit -m "hotfix: patch CVE-2025-12345 vulnerability"

# Administrative version bump
git commit -m "feat: add CODEOWNERS file"

# Quick documentation fix
git commit -m "bug: fix typo in installation guide"
```

**Critical Rules**:

-   ✅ Only use for emergency fixes or trivial administrative changes
-   ✅ Commits MUST start with `task:`, `feat:`, `bug:`, or `hotfix:` to trigger version bumps
-   ✅ Commits without these prefixes will NOT bump versions
-   ✅ Commits starting with "Bump version to" are ignored to prevent infinite loops
-   ❌ Do NOT use for regular development work
-   ❌ Do NOT bypass code review requirements
-   ❌ Do NOT use as a shortcut to avoid creating issues

**Workflow Trigger**: The `direct-push-version-bump.yml` workflow runs on every push to `main` and checks commit messages for these prefixes.

**Best Practice**: Even for emergency hotfixes, create an issue and let automation handle the branch/PR creation when possible. This maintains full traceability and follows proper review processes.


## 🔄 Best Practices for Merging

### Prefer Rebase Over Merge

To maintain a clean, linear git history, **rebase your branches** before merging whenever possible:

```bash
# Update your feature branch with latest changes from parent task branch
git checkout feature/123-my-feature
git fetch origin
git rebase origin/task/100-parent-task

# If conflicts occur, resolve them
git add <resolved-files>
git rebase --continue

# Force push after rebase (safe for your branch only!)
git push --force-with-lease
```

### When to Rebase

✅ **Do rebase when:**

-   Updating your branch with parent branch changes before review
-   Your branch has fallen behind its parent
-   Cleaning up your commit history before PR review
-   Working on a branch you own exclusively

❌ **Don't rebase when:**

-   Others are working on the same branch
-   PR has already been approved (unless reviewer requests it)
-   Working on protected branches (main, or parent branches)
-   After PR review has started (unless coordinated with reviewers)

### Rebase vs. Merge Commit

**Rebase advantages:**

-   Clean, linear history
-   Easier to follow in `git log`
-   Each commit applies cleanly on top of parent
-   Better for bisecting and cherry-picking

**Merge commit advantages:**

-   Preserves exact history of when work was done
-   Safer for collaborative branches
-   No force-push needed

**Recommendation**: Use rebase for feature/bug/hotfix branches. Let GitHub create merge commits when merging PRs.

### Resolving Rebase Conflicts

```bash
# Start the rebase
git rebase origin/parent-branch

# If conflicts occur:
# 1. Git will pause and show conflicting files
# 2. Open files and resolve conflicts manually
# 3. Stage the resolved files
git add <resolved-files>

# 4. Continue the rebase
git rebase --continue

# If you get stuck or want to start over:
git rebase --abort

# After successful rebase, force push
git push --force-with-lease origin your-branch
```

### Interactive Rebase for Clean History

Before requesting PR review, clean up your commits:

```bash
# Rebase last 5 commits interactively
git rebase -i HEAD~5

# In the editor:
# - 'pick' to keep a commit
# - 'squash' or 'fixup' to combine with previous commit
# - 'reword' to change commit message
# - 'drop' to remove a commit

# Example:
# pick abc123 Initial implementation
# squash def456 Fix typo
# squash ghi789 Address review comments
# pick jkl012 Add tests
```

## 🛠 Critical Files

-   `VERSION`: Source of truth for the current version.
-   `package.json`: Synced with `VERSION` automatically.

### Pre-Commit Hook for Version Sync

To prevent version sync issues, install the provided pre-commit hook:

```bash
# Install the pre-commit hook
chmod +x scripts/pre-commit.sh
ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit

# Or copy it directly
cp scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

This hook will:

-   ✅ Validate VERSION file format
-   ✅ Check VERSION and package.json are in sync
-   ✅ Warn about hotfix letter overflow (past 'y')
-   ❌ Block commits if versions don't match

**Manual sync commands** (if hook catches mismatch):

```bash
# Sync package.json to VERSION file
jq --arg v "$(cat VERSION)" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json

# Or sync VERSION to package.json
jq -r '.version' package.json > VERSION
```

**Note**: The automated workflows also sync these files, but the pre-commit hook helps catch issues early in your local development.
=======
# Contributing to kiex-status

## Branching Strategy

We follow a strict hierarchical branching model based on the Issue-Driven Hierarchy.

- **`main`**: The primary development branch. Task branches merge here.
- **`release`**: The production branch. Code is merged here only when ready for a release.
- **Hierarchical Branches**:
  - `task/*`: Major units of work (merges to main)
  - `feature/*`: Sub-components of a task (merges to parent task)
  - `bug/*`: Bug fixes for a feature or task (merges to parent)
  - `hotfix/*`: Urgent fixes for a bug (merges to parent bug)

**Rule**: Do not push directly to `main` or `release`. Use Pull Requests.

## Versioning

<<<<<<<< HEAD:docs/CONTRIBUTING.md
We use a 4-digit versioning system: `Major.Task.Feature.Bug[a-z]` (e.g., `0.1.0.0` or `0.1.0.0a`).
========
We use a 4-digit versioning system with optional hotfix suffix: `Release.Major.Minor.Patch[Hotfix]` (e.g., `0.1.0.0` or `0.1.0.0a`).
>>>>>>>> c265aab (Adds #6: [FEATURE]: Tile Component (#10)):docs/contributing.md

- **Major** (1st digit): Major releases (bumped on release branch)
- **Task** (2nd digit): Major units of work (bumped when Task PR merges to main)
- **Feature** (3rd digit): Feature additions (bumped when Feature PR merges to Task)
- **Bug** (4th digit): Bug fixes (bumped when Bug PR merges to Feature/Task)
- **Hotfix** (letter): Urgent patches (a, b, c... bumped when Hotfix PR merges to Bug)

The current version is stored in the `VERSION` file.

## Release Process

1.  **Develop**: Merge Tasks into `main`.
2.  **PR**: Open a Pull Request from `main` to `release`.
3.  **Release**: Merging the PR into `release` will automatically:
    - Increment the **Major** version (1st digit) (e.g., `0.1.0.0` -> `1.0.0.0`).
    - Update the `VERSION` file and push a commit.
    - Create a new GitHub Release and Tag.

_Note: Version bumping is automatic based on PR labels and branch hierarchy._
