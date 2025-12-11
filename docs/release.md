# Release Process

Complete guide for creating major version releases in the Issue-Driven Hierarchy workflow.

## 🎯 Overview

Releases represent major milestones when you're ready to ship a stable version to production. The release process bumps the **1st digit** (Major version) and resets all other version components.

**Version Example**: `0.5.3.2` → `1.0.0.0`

---

## 🔄 Semantic Versioning Scheme

This template uses a 4-digit versioning system with optional hotfix letter:

```
Major.Task.Feature.Bug[a-z]
  │     │      │      │  └─ Hotfix letter (a, b, c...)
  │     │      │      └──── Bug fixes
  │     │      └─────────── Features within tasks
  │     └────────────────── Major task completions
  └──────────────────────── Major releases
```

### When to Bump Each Digit

| Digit           | Bumped By          | Example    | Use Case                           |
| --------------- | ------------------ | ---------- | ---------------------------------- |
| 1st (Major)     | Release branch     | `1.0.0.0`  | Major milestones, breaking changes |
| 2nd (Task)      | Task → Main        | `0.2.0.0`  | Completing major work units        |
| 3rd (Feature)   | Feature → Task     | `0.1.3.0`  | Adding new features                |
| 4th (Bug)       | Bug → Feature/Task | `0.1.2.2`  | Fixing bugs                        |
| Letter (Hotfix) | Hotfix → Bug       | `0.1.2.1a` | Urgent patches                     |

---

## 📋 Pre-Release Checklist

Before creating a release, ensure:

### 1. Code Quality

-   [ ] All PRs merged and tested
-   [ ] No open critical bugs
-   [ ] All tests passing
-   [ ] Code reviews completed
-   [ ] Documentation up to date

### 2. Version State

-   [ ] Current VERSION reflects all changes
-   [ ] package.json in sync with VERSION
-   [ ] Changelog contains all notable changes
-   [ ] No uncommitted changes

### 3. Testing & Validation

-   [ ] Integration tests pass
-   [ ] Performance benchmarks acceptable
-   [ ] Security scan completed
-   [ ] Breaking changes documented

### 4. Communication

-   [ ] Team notified of release plan
-   [ ] Release notes drafted
-   [ ] Migration guide ready (if breaking changes)

---

## 🚀 Release Methods

### Method 1: Automated Release (Recommended)

**Best for**: Standard releases with full automation

#### Steps:

1. **Ensure main branch is stable**

    ```bash
    git checkout main
    git pull origin main
    ```

2. **Create release branch**

    ```bash
    git checkout -b release
    ```

3. **Push to trigger workflow**

    ```bash
    git push origin release
    ```

4. **Workflow automatically**:

    - Bumps major version to next integer
    - Resets Task/Feature/Bug to 0
    - Updates VERSION and package.json
    - Creates GitHub release with tag
    - Merges release back to main

5. **Monitor Actions tab**

    - Watch workflow progress
    - Check for any errors
    - Verify release created

6. **Clean up**
    ```bash
    git checkout main
    git pull origin main
    git branch -d release
    ```

**Example Workflow Output**:

```
Current version: 0.5.3.2
New version: 1.0.0.0
✅ Created release v1.0.0.0
✅ Merged release back to main
```

---

### Method 2: Manual Workflow Trigger

**Best for**: Testing or re-running failed releases

#### Steps:

1. **Go to Actions tab** in GitHub
2. **Select "Release" workflow**
3. **Click "Run workflow"**
4. **Select branch**: `release` or `main`
5. **Click "Run workflow"** (green button)

---

### Method 3: Manual Release (Advanced)

**Best for**: Custom release scenarios or troubleshooting

#### Steps:

1. **Create and checkout release branch**

    ```bash
    git checkout main
    git pull origin main
    git checkout -b release
    ```

2. **Manually bump version**

    ```bash
    # Get current version
    CURRENT_VERSION=$(cat VERSION)
    echo "Current: $CURRENT_VERSION"

    # Calculate new major version
    MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
    NEW_MAJOR=$((MAJOR + 1))
    NEW_VERSION="${NEW_MAJOR}.0.0.0"

    # Update VERSION file
    echo "$NEW_VERSION" > VERSION

    # Update package.json
    jq --arg v "$NEW_VERSION" '.version = $v' package.json > package.json.tmp
    mv package.json.tmp package.json
    ```

3. **Update changelog**

    ```bash
    # Edit docs/changelog.md
    # Add new section for this release
    ```

4. **Commit changes**

    ```bash
    git add VERSION package.json docs/changelog.md
    git commit -m "Release $NEW_VERSION"
    git push origin release
    ```

5. **Create GitHub release**

    ```bash
    gh release create "v$NEW_VERSION" \
      --title "Release v$NEW_VERSION" \
      --notes-file release-notes.md \
      --target release
    ```

6. **Merge back to main**

    ```bash
    git checkout main
    git pull origin main
    git merge --no-ff release -m "Merge release $NEW_VERSION to main"
    git push origin main
    ```

7. **Clean up release branch**
    ```bash
    git push origin --delete release
    git branch -d release
    ```

---

## 📝 Writing Release Notes

Good release notes help users understand what's new, what changed, and what actions they need to take.

### Template

```markdown
# Release v1.0.0

Released: [Date]

## 🎉 Highlights

[Brief summary of major features or changes]

## ✨ New Features

-   [Feature 1 description] (#issue-number)
-   [Feature 2 description] (#issue-number)

## 🔧 Improvements

-   [Improvement 1] (#issue-number)
-   [Improvement 2] (#issue-number)

## 🐛 Bug Fixes

-   [Bug fix 1] (#issue-number)
-   [Bug fix 2] (#issue-number)

## 💥 Breaking Changes

**Important**: This release contains breaking changes.

-   [Breaking change 1]
    -   **Before**: [Old behavior]
    -   **After**: [New behavior]
    -   **Migration**: [How to update]

## 📚 Documentation

-   [Link to updated docs]
-   [Link to migration guide]

## 🙏 Acknowledgments

Thanks to all contributors:

-   [@username1]
-   [@username2]

## 📦 Full Changelog

See [changelog.md](docs/changelog.md) for complete details.
```

---

## 🔧 Troubleshooting

### Release Workflow Failed

**Problem**: Workflow encountered an error

**Solutions**:

1. **Check Actions tab** for error details
2. **Common causes**:

    - Merge conflict with main
    - Invalid VERSION format
    - Missing permissions
    - Network issues

3. **Fix and retry**:
    - Fix the issue locally
    - Delete release branch: `git push origin --delete release`
    - Re-run release process

### Merge Conflict When Merging to Main

**Problem**: Release branch conflicts with main

**Solution**:

```bash
# On release branch
git fetch origin main
git merge origin/main

# Resolve conflicts manually
# Edit conflicting files
git add .
git commit -m "Resolve merge conflicts"
git push origin release

# Re-trigger workflow or merge manually
```

### Wrong Version Number

**Problem**: Release created with incorrect version

**Solution**:

1. **Delete the release**:

    ```bash
    gh release delete v1.0.0.0 --yes
    git push origin --delete v1.0.0.0  # Delete tag
    ```

2. **Reset release branch**:

    ```bash
    git checkout release
    git reset --hard origin/main
    ```

3. **Fix version and retry**

### Release Workflow Didn't Run

**Problem**: Pushed release branch but workflow didn't trigger

**Solutions**:

1. **Check workflow file** exists: `.github/workflows/release.yml`
2. **Verify branch name** is exactly `release`
3. **Check Actions permissions** (Settings → Actions → General)
4. **Manually trigger** via Actions tab

---

## 📊 Release Cadence Recommendations

### Version 0.x (Pre-1.0)

-   **Purpose**: Development and testing
-   **Cadence**: As needed for milestones
-   **Criteria**: Feature-complete enough for testing

### Version 1.0

-   **Purpose**: First production-ready release
-   **Criteria**:
    -   API stable
    -   Core features complete
    -   Documentation comprehensive
    -   Production-tested
    -   Security reviewed

### Post-1.0 Releases

-   **Major (2.0, 3.0)**: When breaking changes needed
-   **Cadence**: Every 6-12 months typical
-   **Planning**: Announce breaking changes in advance

---

## 🎯 Release Strategy Examples

### Example 1: Beta Testing

```bash
# Before 1.0, use task versions for betas
0.1.0.0  # Beta 1
0.2.0.0  # Beta 2
0.3.0.0  # Beta 3
1.0.0.0  # Official release
```

### Example 2: Long-Term Support (LTS)

```bash
1.0.0.0  # LTS Version 1
1.5.0.0  # Bug fixes and minor features
2.0.0.0  # Next LTS, breaking changes
```

### Example 3: Rapid Iteration

```bash
1.0.0.0  # Release
1.0.1.0  # Small features
1.0.2.0  # More features
1.0.2.1  # Bug fix
1.0.2.1a # Hotfix
```

---

## 🔒 Emergency Hotfix Releases

If critical bugs found in production **after** a major release:

### Option 1: Hotfix Branch (Recommended)

1. Create hotfix issue with `hotfix` label
2. Let automation create hotfix branch
3. Fix the bug
4. Merge PR (bumps hotfix letter)
5. Version becomes: `1.0.0.0` → `1.0.0.0a`

### Option 2: Quick Patch

1. Create bug branch from main
2. Fix the issue
3. Merge to main (bumps bug digit)
4. Version becomes: `1.0.0.0` → `1.0.0.1`

---

## 📋 Post-Release Checklist

After release is published:

-   [ ] Verify release appears on GitHub Releases page
-   [ ] Check release tag created correctly
-   [ ] Confirm main branch has correct version
-   [ ] Update project board/roadmap
-   [ ] Announce release to team/users
-   [ ] Monitor for issues
-   [ ] Update any deployment documentation
-   [ ] Archive or close completed issues
-   [ ] Plan next release milestones

---

## 🔗 Related Documentation

-   [Architecture](architecture.md) - Branching hierarchy
-   [Versioning](versioning.md) - Version number meanings
-   [Contributing](contributing.md) - Development workflow
-   [Changelog](changelog.md) - Version history

---

## 💡 Best Practices

1. **Plan releases ahead**: Don't rush major versions
2. **Communicate early**: Let users know what's coming
3. **Test thoroughly**: Major releases should be stable
4. **Document breaking changes**: Make migration easy
5. **Keep changelog updated**: Helps write release notes
6. **Tag strategically**: Use semantic version tags
7. **Celebrate milestones**: Releases are achievements! 🎉

---

## 🆘 Need Help?

-   Check [workflow documentation](.github/workflows/README.md)
-   Review [GitHub Actions logs](../../actions)
-   See [troubleshooting guide](best-practices.md#troubleshooting)
-   Open an issue with `help` label
