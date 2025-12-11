# Quick Start Guide

Get up and running with the Issue-Driven Hierarchy workflow in minutes.

## Prerequisites

Before you begin, ensure you have:

-   A GitHub account with repository creation permissions
-   Git installed locally (v2.23 or later)
-   GitHub CLI installed (optional): `gh --version`

## 1. Create from Template

### Option A: GitHub Web Interface

1. Click **"Use this template"** at the top of the repository
2. Fill in repository details:
    - Owner: Your username/organization
    - Name: Your project name
    - Visibility: Public or Private
3. Click **"Create repository from template"**

### Option B: GitHub CLI

```bash
gh repo create my-project --template kiriketsuki/template-repo --public
cd my-project
```

## 2. Initial Setup

### Automated Setup (Recommended)

Run the interactive setup script:

```bash
chmod +x scripts/setup-template.sh
./scripts/setup-template.sh
```

The script will guide you through:

-   Project name and description
-   Author information
-   GitHub repository configuration
-   File updates (package.json, settings.yml, etc.)
-   README migration

### Manual Setup

Update these files with your project information:

#### package.json

```json
{
    "name": "your-project-name",
    "description": "Your project description",
    "author": "Your Name <email@example.com>",
    "repository": {
        "type": "git",
        "url": "https://github.com/yourusername/your-project.git"
    }
}
```

#### README.md

Replace template content with your project's documentation.

#### .github/copilot-instructions.md

Customize for your project's specific guidelines.

## 3. Create Required Labels

The workflows need these labels to function:

### Using GitHub CLI (Recommended)

```bash
gh label create task --color "0052CC" --description "Major unit of work"
gh label create feature --color "1D76DB" --description "Sub-component of a task"
gh label create bug --color "D73A4A" --description "Fix for a feature or task"
gh label create hotfix --color "B60205" --description "Urgent production fix"
gh label create implementation --color "5319E7" --description "Major implementation work"
gh label create addition --color "0E8A16" --description "New addition to existing feature"
gh label create fix --color "D93F0B" --description "Bug fix or correction"
```

### Using GitHub Web Interface

1. Go to repository **Settings** → **Labels**
2. Click **New label** for each:

| Name           | Color   | Description                      |
| -------------- | ------- | -------------------------------- |
| task           | #0052CC | Major unit of work               |
| feature        | #1D76DB | Sub-component of a task          |
| bug            | #D73A4A | Fix for a feature or task        |
| hotfix         | #B60205 | Urgent production fix            |
| implementation | #5319E7 | Major implementation work        |
| addition       | #0E8A16 | New addition to existing feature |
| fix            | #D93F0B | Bug fix or correction            |

## 4. Configure Repository Settings

### Branch Protection

Protect your `main` branch:

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
    - ✅ Require a pull request before merging
    - ✅ Require approvals (1 or more)
    - ✅ Require conversation resolution before merging
    - ✅ Do not allow bypassing the above settings

### Actions Permissions

1. Go to **Settings** → **Actions** → **General**
2. Set:
    - ✅ Allow all actions and reusable workflows
3. Workflow permissions:
    - ✅ Read and write permissions
    - ✅ Allow GitHub Actions to create and approve pull requests

### General Settings

1. Go to **Settings** → **General**
2. Under "Pull Requests":
    - ✅ Allow rebase merging (recommended)
    - ✅ Automatically delete head branches
3. Ensure:
    - ✅ Issues are enabled
    - ✅ Default branch is `main`

## 5. Test the Workflow

Create your first task to verify everything works:

### Create a Task Issue

1. Go to **Issues** → **New issue**
2. Select **Task** template
3. Fill in:
    - Title: `[Task]: Initial project setup`
    - Description: Describe the work
4. Add label: `task`
5. Submit

### Verify Automation

Within seconds, you should see:

-   ✅ GitHub Actions workflow running (Actions tab)
-   ✅ Comment: "Branch `task/1-initial-project-setup` created!"
-   ✅ Comment: "Pull request created: [link]"
-   ✅ New branch visible in branches list
-   ✅ PR opened to `main` with `implementation` label

### If Automation Fails

1. Check **Actions** tab for errors
2. Verify labels exist
3. Check workflow permissions
4. Manually trigger via **Actions** → **Create Task Branch** → **Run workflow**

## 6. Start Development

### Checkout the Branch

```bash
# Clone if needed
git clone https://github.com/yourusername/your-project.git
cd your-project

# Fetch and checkout your task branch
git fetch origin
git checkout task/1-initial-project-setup
```

### Make Changes

```bash
# Create your files
mkdir -p src tests
touch src/main.py tests/test_main.py

# Commit changes
git add .
git commit -m "chore: create initial project structure"
git push origin task/1-initial-project-setup
```

### Complete the PR

1. Go to the PR on GitHub
2. Request review (if required)
3. Wait for approval
4. Click **Merge pull request**
5. Watch version bump automatically! 🎉

## 7. Understanding the Workflow

### The Hierarchy

```
Main (Production)
  ↑
Task (Major work)        ← Merges bump 2nd digit: 0.1.x.x → 0.2.0.0
  ↑
Feature (Components)     ← Merges bump 3rd digit: 0.1.2.x → 0.1.3.0
  ↑
Bug (Fixes)              ← Merges bump 4th digit: 0.1.2.1 → 0.1.2.2
  ↑
Hotfix (Urgent fixes)    ← Merges bump letter: 0.1.2.1 → 0.1.2.1a
```

### Creating Work at Each Level

#### Task (Major Work)

```
Issue Label: task
No parent required
Branches from: main
Merges to: main
PR Label: implementation
Version bump: 2nd digit

Manual branch: task/<slug>
```

#### Feature (Sub-component)

```
Issue Label: feature
Parent: Task issue number required
Branches from: Parent task branch
Merges to: Parent task branch
PR Label: addition
Version bump: 3rd digit

Manual branch: feature/<slug>
```

#### Bug (Fix)

```
Issue Label: bug
Parent: Feature/Task issue number required
Branches from: Parent branch
Merges to: Parent branch
PR Label: fix
Version bump: 4th digit

Manual branch: bug/<slug>
```

#### Hotfix (Urgent Fix)

```
Issue Label: hotfix
Parent: Bug issue number required (or main for emergencies)
Branches from: Parent branch
Merges to: Parent branch
PR Label: fix
Version bump: Letter suffix

Manual branch: hotfix/<slug>
```

### Manual Branch Creation (Rapid Development)

If you need to start work immediately without creating an issue first:

```bash
# Create branch following naming convention
git checkout -b task/user-authentication
# or
git checkout -b feature/login-form
# or
git checkout -b bug/fix-validation
# or
git checkout -b hotfix/security-patch

# Do your work...
git add .
git commit -m "your changes"
git push origin <branch-name>
```

**Then complete the workflow:**

1. **Create GitHub issue** describing the work
2. **Create PR** to appropriate parent branch:
    - Task → `main`
    - Feature → parent task branch
    - Bug → parent feature/task branch
    - Hotfix → parent bug branch or `main`
3. **Add correct label** to PR:
    - `implementation` for tasks
    - `addition` for features
    - `fix` for bugs and hotfixes
4. **Reference issue** in PR: `Closes #<issue-number>`

## 8. Common Commands

### Check Current Version

```bash
cat VERSION
```

### View All Branches

```bash
git branch -a
```

### Switch to a Branch

```bash
git checkout feature/5-user-auth
```

### Update Branch from Parent

```bash
git fetch origin
git rebase origin/task/2-user-module
```

### View Workflow Runs

```bash
gh run list
```

### Manually Trigger Workflow

```bash
gh workflow run "Create Feature Branch" -f issue_number=5
```

## 9. Next Steps

Now that you're set up:

1. **Read the full documentation**:

    - [Architecture](architecture.md) - Understand the structure
    - [Versioning](versioning.md) - Learn version bumping
    - [Contributing](contributing.md) - Detailed workflow guide
    - [Setup](setup.md) - Advanced configuration

2. **Try the complete workflow**:

    - Create a task
    - Add features to it
    - Fix a bug in a feature
    - Apply a hotfix to a bug

3. **Customize for your project**:
    - Add CI/CD workflows
    - Configure code quality tools
    - Set up your development environment
    - Add project-specific documentation

## Troubleshooting

### Workflow Didn't Trigger

-   Verify label exists and is applied to issue
-   Check Actions permissions
-   Manually trigger from Actions tab

### Branch Not Created

-   Check Actions logs for errors
-   Verify repository permissions
-   Ensure branch doesn't already exist

### PR Not Created

-   Check if branch exists
-   Verify parent branch is valid
-   Check Actions logs

### Version Didn't Bump

-   Verify PR was merged (not closed)
-   Check branch naming convention
-   Review Actions logs for errors

### Need More Help?

-   Check the [Contributing Guide](contributing.md#troubleshooting) for detailed troubleshooting
-   Review [Architecture](architecture.md) to understand the system
-   Open an issue on the template repository

## Tips for Success

### DO:

-   ✅ Prefer issue-driven workflow for full automation
-   ✅ Use manual branches when rapid development is needed
-   ✅ Always create issue + PR for manual branches
-   ✅ Use correct labels on issues and PRs
-   ✅ Fill in parent issue numbers
-   ✅ Review PRs before merging
-   ✅ Keep branches up to date with parent

### DON'T:

-   ❌ Push directly to main
-   ❌ Skip creating issues (even for manual branches)
-   ❌ Skip parent issue numbers in issue templates
-   ❌ Merge without testing
-   ❌ Force push to shared branches
-   ❌ Forget to add PR labels when creating manually

---

**You're ready to go! Start by creating your first task issue.**
