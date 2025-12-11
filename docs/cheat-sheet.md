# Issue-Driven Hierarchy Cheat Sheet

Quick reference for common operations in the Issue-Driven Hierarchy workflow.

## 🎯 Quick Start

```bash
# 1. Create repo from template
gh repo create my-project --template kiriketsuki/template-repo --public
cd my-project

# 2. Run setup
chmod +x scripts/setup-template.sh
./scripts/setup-template.sh

# 3. Create labels (or trigger label-sync workflow)
gh label create task --color "0052CC" --description "Major unit of work"
gh label create feature --color "1D76DB" --description "Sub-component of a task"
gh label create bug --color "D73A4A" --description "Fix for a feature or task"
gh label create hotfix --color "B60205" --description "Urgent production fix"
```

---

## 📋 Issue Creation

### Create Task Issue

```bash
# Via GitHub UI: New Issue → Task Template
# Or via CLI:
gh issue create --title "[TASK]: Implement user authentication" --label "task"
```

### Create Feature Issue

```bash
# Via GitHub UI: New Issue → Feature Template
# Parent Task Issue Number: 10
# Or via CLI:
gh issue create --title "[FEATURE]: Add login form" --label "feature" --body "### Parent Task Issue Number

10

### Description

Create login form component"
```

### Create Bug Issue

```bash
# Via GitHub UI: New Issue → Bug Template
# Parent Issue Number: 15
# Or via CLI:
gh issue create --title "[BUG]: Fix validation error" --label "bug" --body "### Parent Issue Number

15

### Description

Password validation fails for special characters"
```

---

## 🌿 Branch Operations

### Automated Branch Creation (Recommended)

1. Create issue with appropriate label → automation handles rest
2. Wait for comment with branch/PR link
3. Checkout and work:

```bash
# After automation creates branch:
git fetch origin
git checkout task/10-implement-user-authentication
```

### Manual Branch Creation (When Needed)

```bash
# Create branch manually
git checkout -b feature/add-login-form

# Do your work
git add .
git commit -m "Add login form component"
git push -u origin feature/add-login-form

# Then create issue and PR with correct label
```

---

## 🔄 Version Bumping

### Automatic (PR Merge)

| Merge Path     | Version Bump | Example                |
| -------------- | ------------ | ---------------------- |
| Task → Main    | 2nd digit    | `0.1.x.x` → `0.2.0.0`  |
| Feature → Task | 3rd digit    | `0.1.2.x` → `0.1.3.0`  |
| Bug → Feature  | 4th digit    | `0.1.2.1` → `0.1.2.2`  |
| Hotfix → Bug   | Letter       | `0.1.2.1` → `0.1.2.1a` |

### Manual (Direct Push - Use Sparingly!)

```bash
# Use semantic commit prefixes:
git commit -m "task: major implementation"   # Bumps 2nd digit
git commit -m "feat: new feature"            # Bumps 3rd digit
git commit -m "bug: fix issue"               # Bumps 4th digit
git commit -m "hotfix: urgent patch"         # Bumps letter

# ⚠️ Only for emergencies or admin tasks!
```

---

## 🔍 Common Commands

### Check Current Version

```bash
cat VERSION
# or
jq -r .version package.json
```

### List All Branches

```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches with last commit
git branch -va
```

### Find Parent Branch

```bash
# For a feature, find its parent task
gh pr list --state all --head feature/11-login-form --json baseRefName --jq '.[0].baseRefName'
```

### View Workflow Runs

```bash
# List recent workflow runs
gh run list --limit 10

# View specific run
gh run view <run-id>

# Watch a running workflow
gh run watch
```

### Manually Trigger Workflow

```bash
# Trigger branch creation for an issue
gh workflow run create-feature-branch.yml -f issue_number=15

# Trigger label sync
gh workflow run label-sync.yml

# Trigger cleanup
gh workflow run cleanup-branches.yml
```

---

## 🐛 Troubleshooting

### Workflow Didn't Trigger

```bash
# 1. Check workflow runs
gh run list --workflow=create-task-branch.yml --limit 5

# 2. Check issue has correct label
gh issue view 10 --json labels --jq '.labels[].name'

# 3. Manually trigger
gh workflow run create-task-branch.yml -f issue_number=10
```

### Version Mismatch

```bash
# Check current versions
cat VERSION
jq -r .version package.json

# Sync package.json to VERSION
jq --arg v "$(cat VERSION)" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json

# Or sync VERSION to package.json
jq -r '.version' package.json > VERSION
```

### Find Open PRs for Issue

```bash
# List all PRs mentioning an issue
gh pr list --search "Fix #10"

# View PR details
gh pr view 15
```

### Branch Already Exists

```bash
# Delete local branch
git branch -d task/10-implement-auth

# Delete remote branch
git push origin --delete task/10-implement-auth

# Re-trigger workflow
gh workflow run create-task-branch.yml -f issue_number=10
```

---

## 📊 Useful Queries

### List All Open Issues by Type

```bash
gh issue list --label task
gh issue list --label feature
gh issue list --label bug
gh issue list --label hotfix
```

### List All Open PRs by Type

```bash
gh pr list --label implementation
gh pr list --label addition
gh pr list --label fix
```

### View Hierarchy for a Feature

```bash
# View feature issue
gh issue view 11

# Find parent task (from issue body)
gh issue view 10

# List related PRs
gh pr list --search "#11"
```

### Recent Version History

```bash
# View recent commits with version bumps
git log --oneline --grep="Bump version to" -10

# View changelog
head -n 50 docs/changelog.md
```

---

## 🔧 Git Hooks

### Install Pre-commit Hook

```bash
# Automatic (via setup script)
./scripts/setup-template.sh

# Manual installation
ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x scripts/pre-commit.sh
chmod +x .git/hooks/pre-commit
```

### Test Pre-commit Hook

```bash
# Make a test change
echo "test" >> VERSION

# Try to commit (should fail if package.json doesn't match)
git add VERSION
git commit -m "test"
```

---

## 🚀 Release Process

### Create Release

```bash
# 1. Ensure all work is merged to main
git checkout main
git pull

# 2. Create release branch
git checkout -b release
git push -u origin release

# 3. Workflow automatically:
#    - Bumps major version
#    - Creates GitHub release
#    - Merges back to main
```

### View Releases

```bash
# List all releases
gh release list

# View specific release
gh release view v1.0.0.0
```

---

## 💡 Pro Tips

### Aliases for Common Operations

Add to `~/.gitconfig`:

```gitconfig
[alias]
    # Quick version check
    ver = !cat VERSION

    # List hierarchy branches
    tasks = !git branch -r | grep task/
    features = !git branch -r | grep feature/
    bugs = !git branch -r | grep bug/

    # Quick PR creation
    pr = !gh pr create --web
```

### Environment Variables

```bash
# Set default repo for gh commands
export GH_REPO="username/my-project"

# Now commands work without specifying repo
gh issue list
gh pr list
```

### Watch for Changes

```bash
# Watch workflow runs
watch -n 5 'gh run list --limit 5'

# Watch PR status
watch -n 10 'gh pr status'
```

---

## 📚 Reference Links

-   **Full Documentation**: [`docs/`](../docs/)
-   **Architecture**: [`docs/architecture.md`](architecture.md)
-   **Contributing**: [`docs/contributing.md`](contributing.md)
-   **Versioning**: [`docs/versioning.md`](versioning.md)
-   **Best Practices**: [`docs/best-practices.md`](best-practices.md)

---

**Remember**: When in doubt, create an issue and let automation handle it! 🚀
