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

We use a 4-digit versioning system: `Major.Task.Feature.Bug[a-z]` (e.g., `0.1.0.0` or `0.1.0.0a`).

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
