# Setup Guide for Issue-Driven Hierarchy Template

This guide walks you through setting up a new project from this template. Follow these steps in order for the smoothest experience.

## 📋 Pre-Setup Checklist

Before you begin, ensure you have:

-   [ ] A GitHub account with repository creation permissions
-   [ ] Git installed locally (v2.23 or later recommended)
-   [ ] GitHub CLI installed (optional, but recommended): `gh --version`
-   [ ] Text editor or IDE ready

---

## 🚀 Step 1: Create Repository from Template

### Option A: Using GitHub Web Interface

1. Click the **"Use this template"** button at the top of the template repository
2. Fill in your repository details:
    - **Owner**: Your username or organization
    - **Repository name**: Your project name (e.g., `my-awesome-project`)
    - **Description**: Brief description of your project
    - **Visibility**: Public or Private
3. Click **"Create repository from template"**

### Option B: Using GitHub CLI

```bash
gh repo create my-awesome-project --template kiriketsuki/template-repo --public
cd my-awesome-project
```

---

## 📝 Step 2: Initial Customization

### Option A: Automated Setup (Recommended)

Run the interactive setup script:

```bash
chmod +x scripts/setup-template.sh
./scripts/setup-template.sh
```

The script will:

-   ✅ Prompt for project information
-   ✅ Update package.json automatically
-   ✅ Update .github/settings.yml
-   ✅ Update .github/copilot-instructions.md
-   ✅ Create a project-specific README
-   ✅ Preserve template README as WORKFLOW.md
-   ✅ Optionally update git remote
-   ✅ Guide you through next steps

**After running the script, skip to Step 3.**

---

### Option B: Manual Customization

Update the following files with your project information:

### 2.1 Update `package.json`

```json
{
    "name": "your-project-name",
    "version": "0.0.0.0",
    "description": "Your project description",
    "author": "Your Name <your.email@example.com>",
    "repository": {
        "type": "git",
        "url": "https://github.com/yourusername/your-project-name.git"
    },
    "bugs": {
        "url": "https://github.com/yourusername/your-project-name/issues"
    },
    "homepage": "https://github.com/yourusername/your-project-name#readme"
}
```

### 2.2 Update `README.md`

Replace the template README content with your project's actual documentation. Keep sections that are still relevant:

-   Architecture/Branching hierarchy explanation
-   Quick start for your actual project
-   Your project's specific documentation

### 2.3 Update `.github/copilot-instructions.md`

Customize the Copilot instructions for your specific project needs. Add any project-specific guidelines, coding standards, or architectural decisions.

### 2.4 Review and Update `LICENSE`

The template uses MIT License. Change if you prefer a different license:

```bash
# Keep MIT
# No action needed

# Or change to another license
# Edit LICENSE file manually
```

### 2.5 Update `.github/settings.yml`

If you're using the [Probot Settings app](https://probot.github.io/apps/settings/), update this file:

```yaml
repository:
    name: your-project-name
    description: Your project description
    homepage: https://github.com/yourusername/your-project-name
```

**Note**: This file requires the Probot Settings app to be installed. Otherwise, configure settings manually.

---

## 🏷️ Step 3: Create Required Labels

The workflows require labels to function. Create them now:

### Option A: Using GitHub CLI (Recommended)

```bash
# Issue type labels
gh label create task --color "0052CC" --description "Major unit of work"
gh label create feature --color "1D76DB" --description "Sub-component of a task"
gh label create bug --color "D73A4A" --description "Fix for a feature or task"
gh label create hotfix --color "B60205" --description "Urgent production fix"

# PR type labels (automatically applied by workflows)
gh label create implementation --color "5319E7" --description "Major implementation work"
gh label create addition --color "0E8A16" --description "New addition to existing feature"
gh label create fix --color "D93F0B" --description "Bug fix or correction"
```

### Option B: Using GitHub Web Interface

1. Go to your repository
2. Click **Issues** → **Labels**
3. Click **New label** for each of these:

**Issue Type Labels:**

| Name    | Color   | Description               |
| ------- | ------- | ------------------------- |
| task    | #0052CC | Major unit of work        |
| feature | #1D76DB | Sub-component of a task   |
| bug     | #D73A4A | Fix for a feature or task |
| hotfix  | #B60205 | Urgent production fix     |

**PR Type Labels** (auto-applied by workflows):

| Name           | Color   | Description                      |
| -------------- | ------- | -------------------------------- |
| implementation | #5319E7 | Major implementation work        |
| addition       | #0E8A16 | New addition to existing feature |
| fix            | #D93F0B | Bug fix or correction            |

---

## 🔒 Step 4: Configure Branch Protection

Protect your `main` branch to enforce the workflow:

### Using GitHub Web Interface

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. For branch name pattern, enter: `main`
4. Enable these settings:
    - ✅ **Require a pull request before merging**
        - ✅ Require approvals: `1` (or more for your team)
        - ✅ Dismiss stale pull request approvals when new commits are pushed
    - ✅ **Require status checks to pass before merging** (optional, if you have CI)
    - ✅ **Require conversation resolution before merging**
    - ✅ **Do not allow bypassing the above settings**
5. Click **Create** (or **Save changes**)

### Using GitHub CLI

```bash
# Basic protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field enforce_admins=true \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

---

## ⚙️ Step 5: Configure Repository Settings

### 5.1 General Settings

Go to **Settings** → **General**:

-   ✅ Enable **Issues**
-   ✅ Enable **Preserve this repository** (optional)
-   ❌ Disable **Wikis** (unless you plan to use them)
-   ❌ Disable **Projects** (unless you plan to use them)

### 5.2 Pull Request Settings

Scroll to **Pull Requests** section:

-   ✅ **Allow rebase merging** (Recommended for clean history)
-   ⚠️ **Allow squash merging** (Use sparingly - can complicate hierarchy)
-   ❌ **Allow merge commits** (Not recommended - creates messy history)
-   ✅ **Automatically delete head branches** (Keeps repo clean)

### 5.3 Actions Settings

Go to **Settings** → **Actions** → **General**:

-   ✅ **Allow all actions and reusable workflows**
-   **Workflow permissions**:
    -   ✅ **Read and write permissions**
    -   ✅ **Allow GitHub Actions to create and approve pull requests**

---

## 🧪 Step 6: Test the Workflow

Time to verify everything works!

### 6.1 Create Your First Task

1. Go to **Issues** → **New issue**
2. Select **Task** template
3. Fill in:
    - Title: `[Task]: Set up initial project structure`
    - Description: `Create basic project directories and files`
4. Add label: `task`
5. Click **Submit new issue**

### 6.2 Verify Automation

Within seconds, you should see:

-   ✅ GitHub Actions workflow running (check **Actions** tab)
-   ✅ A comment on your issue: "Branch `task/1-set-up-initial-project-structure` created!"
-   ✅ Another comment: "Pull request created: [link]"
-   ✅ A new branch created
-   ✅ A PR opened to `main` with `implementation` label

### 6.3 If Something Went Wrong

**No automation triggered?**

-   Check that the `task` label exists and is applied
-   Go to **Actions** tab → Select **Create Task Branch** → **Run workflow** → Enter issue number: `1`

**Workflow failed?**

-   Click on the failed workflow in Actions tab
-   Read the error message
-   Common issues:
    -   Labels not created → Go back to Step 3
    -   Permissions issues → Check Step 5.3
    -   Branch already exists → Delete it and try again

---

## 📦 Step 7: Add Your Project Files

Now you can start adding your actual project code!

### 7.1 Checkout Your Task Branch

```bash
# Clone if you haven't already
git clone https://github.com/yourusername/your-project-name.git
cd your-project-name

# Checkout your task branch
git checkout task/1-set-up-initial-project-structure

# Start working!
```

### 7.2 Make Your Changes

```bash
# Create your project structure
mkdir -p src tests docs
touch src/main.py tests/test_main.py

# Add a README for your actual project
echo "# My Awesome Project" > PROJECT_README.md

# Commit your changes
git add .
git commit -m "chore: set up initial project structure"
git push origin task/1-set-up-initial-project-structure
```

### 7.3 Complete the PR

1. Go to your PR in GitHub
2. Request review (if required)
3. Wait for approval
4. Click **Merge pull request**
5. Watch as the version automatically bumps to `0.1.0.0`! 🎉

---

## 🎓 Step 8: Learn the Workflow

Now that everything is set up, learn how to use the system effectively:

### Read the Documentation

-   **[Contributing Guide](docs/contributing.md)** - Complete workflow explanation
-   **[Workflow Documentation](.github/workflows/README.md)** - How automation works
-   **[README](README.md)** - Quick reference and best practices

### Practice the Hierarchy

Try creating issues in order:

1. **Task** (branches from main) - PR gets `implementation` label
2. **Feature** (branches from task) - PR gets `addition` label - Parent Task Issue Number: `1`
3. **Bug** (branches from feature) - PR gets `fix` label - Parent Issue Number: `2`
4. **Hotfix** (branches from bug or main) - PR gets `fix` label - Parent Issue Number: `3`

### Learn the Merge Flow

Understand how versions bump:

-   Hotfix → Bug: `0.1.0.0` → `0.1.0.0a`
-   Bug → Feature: `0.1.0.0` → `0.1.0.1`
-   Feature → Task: `0.1.0.0` → `0.1.1.0`
-   Task → Main: `0.1.0.0` → `0.2.0.0`

---

## 🎯 Step 9: Customize Further (Optional)

### 9.1 Add CI/CD

Add your test workflows to `.github/workflows/`:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - name: Run tests
              run: npm test # or your test command
```

### 9.2 Add Additional Issue Templates

Create custom issue templates in `.github/ISSUE_TEMPLATE/` for:

-   Documentation requests
-   Questions
-   Refactoring tasks
-   Performance improvements

### 9.3 Customize Version Format

Edit `.github/workflows/version-bump.yml` if you want a different versioning scheme (though not recommended if you want to keep the hierarchy concept).

---

## ✅ Setup Complete!

Your repository is now ready to use with the Issue-Driven Hierarchy workflow!

### Quick Reference Card

**Create work:**

1. Open issue with correct label
2. Wait for automation
3. Checkout branch
4. Make changes
5. Push
6. Merge PR
7. Version bumps automatically

**Issue Labels:**

-   `task` - Major work (PR gets `implementation` label)
-   `feature` - Sub-components (PR gets `addition` label)
-   `bug` - Fixes (PR gets `fix` label)
-   `hotfix` - Urgent fixes (PR gets `fix` label)

**Need help?**

-   Check [Troubleshooting](.github/workflows/README.md#-troubleshooting)
-   Open an issue on the template repository
-   Review the [Contributing Guide](docs/contributing.md)

---

## 🔧 Maintenance

### Regular Tasks

**Weekly:**

-   Review open issues
-   Close stale branches
-   Update documentation

**Monthly:**

-   Review workflow efficiency
-   Update dependencies
-   Check for template updates

**When releasing:**

```bash
git checkout -b release
git push origin release
# Triggers major version bump and GitHub Release
```

---

**Happy coding with structured, automated workflows!**
