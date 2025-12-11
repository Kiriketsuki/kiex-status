# Migration Guide

This guide helps you adopt the Issue-Driven Hierarchy workflow into an existing repository.

## Table of Contents

-   [Overview](#overview)
-   [Prerequisites](#prerequisites)
-   [Migration Steps](#migration-steps)
-   [Migrating from Different Versioning Systems](#migrating-from-different-versioning-systems)
-   [Post-Migration Checklist](#post-migration-checklist)
-   [Troubleshooting](#troubleshooting)

## Overview

The Issue-Driven Hierarchy template provides:

-   Structured branching model (`Main` ← `Task` ← `Feature` ← `Bug` ← `Hotfix`)
-   Automated branch creation from GitHub Issues
-   Automatic version bumping on PR merges
-   Standardized 4-digit versioning: `Major.Task.Feature.Bug[a-z]`

## Prerequisites

Before starting the migration:

1. **Backup your repository**: Create a full backup or tag your current state

    ```bash
    git tag pre-migration-backup
    git push origin pre-migration-backup
    ```

2. **Clean working directory**: Ensure all changes are committed

    ```bash
    git status
    ```

3. **Document current workflow**: Note your existing branching strategy and versioning system

4. **Team alignment**: Ensure all team members understand the new workflow

## Migration Steps

### Step 1: Copy Template Files

1. Clone or download the template repository
2. Copy the following files/directories to your repository:

```bash
# Essential files
cp template-repo/.github/workflows/* your-repo/.github/workflows/
cp template-repo/.github/ISSUE_TEMPLATE/* your-repo/.github/ISSUE_TEMPLATE/
cp template-repo/scripts/* your-repo/scripts/
cp template-repo/VERSION your-repo/VERSION

# Documentation (optional but recommended)
cp template-repo/docs/* your-repo/docs/
cp template-repo/.github/copilot-instructions.md your-repo/.github/
```

### Step 2: Initialize VERSION File

Choose your starting version based on your project maturity:

**For new projects or pre-1.0 projects:**

```bash
echo "0.1.0.0" > VERSION
```

**For mature projects:**

```bash
echo "1.0.0.0" > VERSION
```

**If maintaining existing version (e.g., you're at v2.3.1):**

```bash
# Convert to 4-digit format
echo "2.3.1.0" > VERSION
```

### Step 3: Update package.json

If you have a `package.json`, sync it with your VERSION file:

```bash
# Manual sync
VERSION=$(cat VERSION)
# Edit package.json and set "version": "your-version"
```

Or let the workflows handle it automatically on the next merge.

### Step 4: Configure Git Hooks (Optional)

Set up pre-commit hooks for version validation:

```bash
chmod +x scripts/pre-commit.sh
# Add to .git/hooks/pre-commit or use a tool like husky
```

### Step 5: Update GitHub Settings

1. **Branch Protection Rules**:

    - Go to Settings → Branches
    - Add protection rule for `main`:
        - Require pull request reviews
        - Require status checks to pass
        - Include administrators (optional)

2. **Issue Labels** (if not auto-created):
    - `implementation` (for Task PRs)
    - `addition` (for Feature PRs)
    - `fix` (for Bug/Hotfix PRs)

### Step 6: Commit Migration Changes

```bash
git checkout main
git add .github/ scripts/ VERSION docs/
git commit -m "task: adopt Issue-Driven Hierarchy workflow"
git push origin main
```

This commit will bump the Task version (2nd digit) automatically.

### Step 7: Test the Workflow

1. Create a test Task issue
2. Verify the workflow creates a branch and PR
3. Make a small change and merge the PR
4. Confirm version bumping works correctly

## Migrating from Different Versioning Systems

### From Semantic Versioning (Major.Minor.Patch)

**Current format:** `2.3.5` (SemVer)  
**Target format:** `2.3.5.0` (Issue-Driven Hierarchy)

**Migration strategy:**

```bash
# If your current version is 2.3.5
echo "2.3.5.0" > VERSION
```

**Mapping:**

-   SemVer `Major` → `Major` (breaking changes)
-   SemVer `Minor` → `Task` (new features/major work)
-   SemVer `Patch` → `Feature` (smaller additions)
-   New `Bug` digit (fixes within features)
-   New `Hotfix` letter (urgent fixes)

**Going forward:**

-   Major breaking changes: Manually update VERSION's 1st digit
-   Tasks (significant features): Use Task PRs (bumps 2nd digit)
-   Features (sub-components): Use Feature PRs (bumps 3rd digit)
-   Bugs (fixes): Use Bug PRs (bumps 4th digit)
-   Hotfixes (urgent): Use Hotfix PRs (bumps letter suffix)

### From Calendar Versioning (YY.MM.Minor.Bug)

**Current format:** `24.11.3.2` (CalVer: Year.Month.Minor.Bug)  
**Target format:** `Major.Task.Feature.Bug` (Issue-Driven)

**Migration strategy:**

**Option 1: Fresh Start (Recommended for clarity)**

```bash
# Start with a clean slate
echo "1.0.0.0" > VERSION
```

-   Document the transition point in CHANGELOG
-   Create a git tag with the old version for reference

```bash
git tag calver-24.11.3.2
git push origin calver-24.11.3.2
```

**Option 2: Preserve Version Numbers**

```bash
# Keep the numbers but change their meaning
# 24.11.3.2 becomes Major.Task.Feature.Bug
echo "24.11.3.2" > VERSION
```

-   Update documentation to clarify new meaning
-   Note: First two digits will now increment differently

**Option 3: Encode Year in Major Version**

```bash
# Year 2024 → Major version 24, then reset Task/Feature/Bug
echo "24.1.0.0" > VERSION
```

-   Increment Major each year manually on January 1st
-   Task/Feature/Bug follow the hierarchy

**Recommendation:** Choose **Option 1** for cleaner semantics. CalVer and Issue-Driven versioning serve different purposes:

-   CalVer: Time-based release tracking
-   Issue-Driven: Hierarchical work tracking

### From Single Increment Versioning (v1, v2, v3)

**Current format:** `v23`  
**Target format:** `Major.Task.Feature.Bug`

**Migration strategy:**

```bash
# Treat your single number as Major version
echo "23.1.0.0" > VERSION
```

**Alternative (fresh start):**

```bash
echo "1.0.0.0" > VERSION
```

Document the mapping in your CHANGELOG or README.

### From No Versioning System

**Starting fresh:**

```bash
# For projects not yet in production
echo "0.1.0.0" > VERSION

# For production projects
echo "1.0.0.0" > VERSION
```

## Post-Migration Checklist

-   [ ] VERSION file created and committed
-   [ ] All workflows copied and functional
-   [ ] Issue templates available
-   [ ] Branch protection rules configured
-   [ ] Team trained on new workflow
-   [ ] Test issue/PR cycle completed successfully
-   [ ] Old version scheme documented (if applicable)
-   [ ] CHANGELOG updated with migration note
-   [ ] CI/CD pipelines updated to read from VERSION file
-   [ ] Documentation updated with new workflow

## Troubleshooting

### Workflow Not Triggering

**Problem:** Creating an issue doesn't create a branch/PR

**Solutions:**

1. Check workflow file permissions in `.github/workflows/`
2. Verify GitHub Actions are enabled (Settings → Actions)
3. Ensure issue uses the correct template with required fields
4. Check workflow logs in Actions tab

### Version Not Bumping

**Problem:** PR merge doesn't update VERSION

**Solutions:**

1. Verify PR has correct label (`implementation`, `addition`, or `fix`)
2. Check PR is merging to the correct parent branch
3. Review workflow logs for errors
4. Ensure VERSION file exists and is properly formatted

### Merge Conflicts with VERSION

**Problem:** Frequent conflicts in VERSION file

**Solutions:**

1. Always merge parent branch into child before creating PR
2. Let workflows handle VERSION updates (don't edit manually)
3. Use rebase workflow for cleaner history:
    ```bash
    git fetch origin
    git rebase origin/parent-branch
    ```

### Package.json Out of Sync

**Problem:** package.json version doesn't match VERSION

**Solutions:**

1. The sync happens automatically on merge
2. To manually sync:
    ```bash
    VERSION=$(cat VERSION)
    npm version $VERSION --no-git-tag-version
    git add package.json
    git commit -m "chore: sync package.json with VERSION"
    ```

### Migration Breaking Existing CI/CD

**Problem:** Existing pipelines don't recognize new version format

**Solutions:**

1. Update CI/CD scripts to read from VERSION file:
    ```bash
    VERSION=$(cat VERSION)
    echo "Building version $VERSION"
    ```
2. Update deployment scripts to parse 4-digit format
3. Add compatibility layer if needed:
    ```bash
    # Convert 1.2.3.4 to 1.2.3 for legacy systems
    LEGACY_VERSION=$(cat VERSION | cut -d. -f1-3)
    ```

## Additional Resources

-   [Architecture Documentation](architecture.md) - Understanding the hierarchy
-   [Versioning Guide](versioning.md) - Detailed version management
-   [Quick Start Guide](quick-start.md) - Getting started quickly
-   [Contributing Guide](contributing.md) - Developer workflow

## Need Help?

If you encounter issues during migration:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review workflow logs in GitHub Actions
3. Open an issue in the template repository
4. Consult the detailed documentation files

---

**Remember:** Migration is a one-time process. Take time to test thoroughly before rolling out to your entire team.
