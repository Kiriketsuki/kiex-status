# Contributing to kiex-status

## Branching Strategy

We follow a strict branching model to ensure stability.

- **`main`**: The primary development branch. All feature branches merge here.
- **`release`**: The production branch. Code is merged here only when ready for a release.
- **Feature Branches**:
  - `feat/*`: New features
  - `bug/*`: Bug fixes
  - `patch/*`: Minor patches
  - `task/*`: Maintenance tasks

**Rule**: Do not push directly to `main` or `release`. Use Pull Requests.

## Versioning

We use a 4-part versioning system with optional hotfix suffix: `Release.Major.Minor.Patch[Hotfix]` (e.g., `0.1.0.0` or `0.1.0.0a`).

- **Release**: Defaults to 0.
- **Major/Minor/Patch**: Standard semantic versioning numbers.
- **Hotfix**: An optional letter (a, b, c...) that only appears when a hotfix is applied to a version.

The current version is stored in the `VERSION` file.

## Release Process

1.  **Develop**: Merge features into `main`.
2.  **PR**: Open a Pull Request from `main` to `release`.
3.  **Release**: Merging the PR into `release` will automatically:
    - Increment the **Patch** version (e.g., `0.1.0.0` -> `0.1.1.0`).
    - Update the `VERSION` file and push a commit.
    - Create a new GitHub Release and Tag.

_Note: To bump Major or Minor versions, manually update the `VERSION` file in your PR before merging._
