# Release Process

This document describes how to create releases and manage the release branch.

## Overview

Releases represent major milestones in your project. When you're ready to release a new major version, use the release branch and workflow to:

1. Bump the major version number (1st digit)
2. Create a GitHub Release
3. Merge changes back to main

## Release Workflow

### When to Create a Release

Consider creating a release when:

-   You've completed all planned tasks for a major version
-   You have breaking changes that warrant a major version bump
-   You've reached a significant milestone
-   You're ready to tag a production-ready version

### Release Branch

The `release` branch is a special branch used for triggering releases:

-   **Purpose**: Trigger major version releases
-   **Source**: Created from `main` when ready to release
-   **Target**: Merges back to `main` after release
-   **Version Bump**: Bumps 1st digit (Major)

## Creating a Release

### Step 1: Prepare Main Branch

Ensure `main` is in a release-ready state:

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Verify current version
cat VERSION
# Example output: 0.5.2.1

# Check that all tests pass and documentation is up to date
```

### Step 2: Create Release Branch

```bash
# Create release branch from main
git checkout -b release
git push origin release
```

### Step 3: Automatic Release Process

The `release.yml` workflow will automatically:

1. Bump the major version (e.g., `0.5.2.1` → `1.0.0.0`)
2. Update `VERSION` file and `package.json`
3. Commit the version bump to the release branch
4. Create a GitHub Release with tag (e.g., `v1.0.0.0`)
5. Merge the release branch back to main

### Step 4: Monitor Workflow

1. Go to **Actions** tab in GitHub
2. Watch the "Release" workflow run
3. Verify the release was created successfully

### Step 5: Update Release Notes

After the release is created:

1. Go to **Releases** in GitHub
2. Find the newly created release
3. Edit the release notes to add:
    - Summary of changes
    - New features
    - Bug fixes
    - Breaking changes
    - Upgrade instructions

## Manual Release (Alternative)

If the automated workflow fails or you need manual control:

### Option 1: Manual Workflow Trigger

1. Go to **Actions** tab
2. Select "Release" workflow
3. Click **Run workflow**
4. Select the `release` branch
5. Click **Run workflow** button

### Option 2: Completely Manual Process

```bash
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release

# 2. Bump version manually
# Edit VERSION file: increment first digit, reset others to 0
# Example: 0.5.2.1 → 1.0.0.0
echo "1.0.0.0" > VERSION

# 3. Update package.json
jq '.version = "1.0.0.0"' package.json > package.json.tmp
mv package.json.tmp package.json

# 4. Commit and push
git add VERSION package.json
git commit -m "Release 1.0.0.0"
git push origin release

# 5. Create GitHub Release
gh release create v1.0.0.0 \
  --title "Release v1.0.0.0" \
  --notes "Automated release for version 1.0.0.0" \
  --target release

# 6. Merge back to main
git checkout main
git pull origin main
git merge --no-ff release -m "Merge release 1.0.0.0 back to main"
git push origin main

# 7. Delete release branch (optional)
git branch -d release
git push origin --delete release
```

## Version Numbering After Release

After a major release, version numbers continue from the new major version:

-   Before release: `0.5.2.1`
-   After release: `1.0.0.0`
-   Next task merge: `1.1.0.0`
-   Next feature merge: `1.1.1.0`
-   Next bug merge: `1.1.1.1`

## Release Checklist

Before creating a release, ensure:

-   [ ] All planned tasks are completed and merged
-   [ ] All tests pass
-   [ ] Documentation is up to date
-   [ ] CHANGELOG.md has all entries for this version
-   [ ] No critical bugs are open
-   [ ] Main branch is stable and ready for production

After creating a release:

-   [ ] Verify GitHub Release was created
-   [ ] Update release notes with detailed changes
-   [ ] Announce release to team/users
-   [ ] Update any external documentation
-   [ ] Archive old versions if needed

## Release Branch Management

### Long-Lived Release Branch

If you maintain long-term support versions:

1. Keep the release branch
2. Cherry-pick critical fixes from main
3. Create patch releases as needed

### Delete After Release

For simpler workflows:

```bash
# After release merges to main
git push origin --delete release
```

## Emergency Release

For critical production issues:

1. Create hotfix from main
2. Merge hotfix to main (bumps letter suffix)
3. If major release needed, follow normal release process

## Troubleshooting

### Release Workflow Failed

If the release workflow fails:

1. Check workflow logs in Actions tab
2. Common issues:

    - Merge conflict when merging back to main
    - GitHub token permissions
    - Invalid VERSION format

3. Manual recovery:
    ```bash
    git checkout main
    git pull origin main
    git merge --no-ff release
    # Resolve conflicts if any
    git push origin main
    ```

### Release Not Created in GitHub

If release creation failed but version was bumped:

```bash
# Get the version from VERSION file
VERSION=$(cat VERSION)

# Create release manually
gh release create "v$VERSION" \
  --title "Release v$VERSION" \
  --notes "Manual release for version $VERSION" \
  --target main
```

### Need to Undo a Release

**Warning**: Undoing a release is complex. Consider creating a new release instead.

If you must undo:

1. Delete the GitHub Release
2. Delete the tag: `git push --delete origin vX.X.X.X`
3. Revert the version bump commit on main
4. Force push (requires admin rights)

## Best Practices

### Release Frequency

-   **Major releases**: Quarterly or when breaking changes accumulate
-   **Minor releases**: Follow your task completion cadence
-   **Hotfixes**: As needed for urgent issues

### Version Strategy

-   Keep major version at 0 during initial development
-   First major release (1.0.0.0) when production-ready
-   Increment major version for breaking changes only

### Release Notes

Good release notes include:

-   **New Features**: What's new for users
-   **Improvements**: Enhancements to existing features
-   **Bug Fixes**: Issues resolved
-   **Breaking Changes**: What might break existing integrations
-   **Upgrade Notes**: Steps needed to upgrade

### Communication

After a release:

-   Notify stakeholders
-   Update project website/documentation
-   Post in communication channels (Slack, Discord, etc.)
-   Update package registries if applicable

## Related Documentation

-   [Versioning](versioning.md) - Detailed version format explanation
-   [Architecture](architecture.md) - Branch hierarchy overview
-   [Contributing](contributing.md) - Development workflow
