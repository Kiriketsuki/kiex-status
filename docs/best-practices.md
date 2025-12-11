# Best Practices

Guidelines and recommendations for working effectively with the Issue-Driven Hierarchy workflow.

## Issue Management

### Creating Good Issues

#### Title Format

Use descriptive titles with the type prefix:

```
[Task]: Implement user authentication system
[Feature]: Add login form component
[Bug]: Fix password validation error
[Hotfix]: Patch security vulnerability in auth
```

#### Description Quality

-   Clearly describe what needs to be done
-   Include acceptance criteria
-   Link to related issues or documentation
-   Add technical details or constraints
-   Specify dependencies

**Good Example**:

```markdown
## Description

Implement the login form component for the user authentication system.

## Acceptance Criteria

-   [ ] Form has email and password fields
-   [ ] Client-side validation for email format
-   [ ] Password must be at least 8 characters
-   [ ] Show/hide password toggle
-   [ ] "Remember me" checkbox
-   [ ] Accessible with proper ARIA labels

## Technical Notes

-   Use React Hook Form for validation
-   Follow existing component patterns in src/components/
-   Add unit tests with React Testing Library

## Related

-   Parent: #10 (User Authentication Task)
-   Designs: Link to Figma
```

#### Parent Issue Numbers

Always specify the correct parent:

-   **Features**: Parent Task Issue Number
-   **Bugs**: Parent Issue Number (usually a feature)
-   **Hotfixes**: Parent Issue Number (usually a bug)

### Managing Issue Lifecycle

#### Labels

Use labels consistently:

-   `task`, `feature`, `bug`, `hotfix` - Issue type
-   `implementation` - Applied to task PRs automatically
-   `addition` - Applied to feature PRs automatically
-   `fix` - Applied to bug/hotfix PRs automatically
-   Consider adding: `documentation`, `testing`, `refactor`, `performance`

#### Milestones

Group related work:

```
Milestone: "v1.0 Release"
- Task: User Authentication
- Task: User Profile Management
- Task: Settings Page
```

#### Projects

Use GitHub Projects for tracking:

-   Organize tasks by priority
-   Track progress across hierarchy
-   Visualize workflow stages

## Branching Strategy

### Branch Naming

**Preferred: Issue-driven (automated naming)**

-   ✅ Create via issue for full automation
-   Branch name includes issue number
-   PR created automatically with correct label

**Alternative: Manual creation (rapid development)**

-   ✅ Allowed for fast iteration
-   Follow naming convention: `<type>/<descriptive-slug>`
-   Must create issue and PR afterward

```bash
# Issue-driven (preferred)
# Create issue first, automation handles the rest

# Manual (when speed is critical)
git checkout -b task/implement-auth
git checkout -b feature/login-ui
git checkout -b bug/fix-crash
git checkout -b hotfix/security-patch

# After manual creation:
# 1. Create GitHub issue
# 2. Create PR with appropriate label
# 3. Link issue in PR: "Closes #X"
```

### Working on Branches

#### Keep Branches Updated

Regularly update your branch from its parent:

```bash
# Feature branch from task
git checkout feature/15-login-form
git fetch origin
git rebase origin/task/10-user-auth

# Resolve conflicts if any
git push --force-with-lease
```

#### Small, Focused Branches

-   Keep branches focused on one issue
-   Avoid scope creep
-   Split large work into multiple issues

#### Clean Commit History

```bash
# Good commits
git commit -m "feat: add email validation"
git commit -m "test: add validation tests"
git commit -m "docs: update README with usage"

# Before merging, clean up if needed
git rebase -i HEAD~3
```

### Branch Cleanup

Branches are automatically deleted after merge (if configured).

Manual cleanup if needed:

```bash
# Delete local branch
git branch -d feature/15-login-form

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/15-login-form
```

## Merging Strategy

### Prefer Rebase Over Merge

Rebasing maintains a clean, linear history:

```bash
# Update your branch
git checkout feature/123-my-feature
git fetch origin
git rebase origin/task/100-parent-task

# If conflicts occur
git add .
git rebase --continue

# Force push (your branch only!)
git push --force-with-lease
```

**When to rebase**:

-   ✅ Before requesting PR review
-   ✅ After parent branch receives updates
-   ✅ To clean up messy commit history
-   ✅ On your own branches

**When NOT to rebase**:

-   ❌ On shared branches with multiple contributors
-   ❌ After PR has been approved (unless requested)
-   ❌ On main or protected branches
-   ❌ On public commits others may have based work on

### Pull Request Reviews

#### Before Requesting Review

-   [ ] Code is complete and tested
-   [ ] Branch is up to date with parent
-   [ ] All tests pass
-   [ ] Code follows project style
-   [ ] Documentation is updated
-   [ ] No merge conflicts

#### Review Process

1. **Author**: Request review from team members
2. **Reviewers**: Provide constructive feedback
3. **Author**: Address feedback, push changes
4. **Reviewers**: Re-review and approve
5. **Author**: Merge when approved

#### PR Description

Use the template to provide context:

```markdown
## Changes

-   Added login form component
-   Implemented validation logic
-   Added unit tests

## Testing

-   Manual testing in dev environment
-   All unit tests pass
-   Tested with various invalid inputs

## Screenshots

[If applicable]

## Notes

-   Depends on PR #44 (merge that first)
```

## Commit Messages

### Semantic Commit Format

Use conventional commit format for direct pushes to main (bypass workflow):

```
<type>: <description>

[optional body]
```

**Types for version bumping**:

-   `task:` - Bumps 2nd digit
-   `feat:` - Bumps 3rd digit
-   `bug:` - Bumps 4th digit
-   `hotfix:` - Bumps letter

**Other types**:

-   `docs:` - Documentation only
-   `test:` - Test changes
-   `chore:` - Maintenance tasks
-   `refactor:` - Code restructuring
-   `style:` - Formatting changes
-   `ci:` - CI/CD changes

**Examples**:

```bash
git commit -m "feat: add password reset functionality"
git commit -m "bug: fix validation error on empty input"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for auth flow"
```

### Commit Message Quality

**Good commits**:

```
feat: add email validation to login form

- Implements RFC 5322 compliant email regex
- Shows inline error message
- Validates on blur and submit
```

**Poor commits**:

```
fix stuff
WIP
asdf
updated code
```

## Version Management

### Let Automation Handle Versions

**DO**:

-   ✅ Let PRs merge to trigger version bumps
-   ✅ Use semantic commit prefixes for direct pushes
-   ✅ Keep VERSION and package.json in sync
-   ✅ Tag releases with version numbers

**DON'T**:

-   ❌ Manually edit version in feature branches
-   ❌ Make version changes without updating both files
-   ❌ Force version numbers that break hierarchy
-   ❌ Skip version bumps by force pushing

### Checking Versions

```bash
# Current version
cat VERSION

# Version history
git log --all --grep="bump version"

# Compare versions across branches
git show main:VERSION
git show task/10-feature:VERSION
```

## Collaboration

### Communication

#### In Issues

-   Comment on progress
-   Ask questions
-   Share blockers
-   Link related work

#### In Pull Requests

-   Explain complex changes
-   Respond to reviews promptly
-   Tag relevant team members
-   Update status

#### Team Coordination

-   Use issue assignments
-   Coordinate parent-child work
-   Communicate dependencies
-   Share knowledge in comments

### Code Review Guidelines

#### As a Reviewer

-   ✅ Be constructive and respectful
-   ✅ Explain why, not just what
-   ✅ Recognize good work
-   ✅ Focus on important issues
-   ✅ Respond promptly

#### As an Author

-   ✅ Don't take feedback personally
-   ✅ Ask for clarification if needed
-   ✅ Explain your reasoning
-   ✅ Be open to suggestions
-   ✅ Thank reviewers

### Handling Conflicts

#### Merge Conflicts

```bash
# Update branch
git fetch origin
git rebase origin/parent-branch

# Conflicts appear - resolve in files
# Then continue
git add .
git rebase --continue

# Force push
git push --force-with-lease
```

#### Workflow Conflicts

-   Two people working on same issue?

    -   Coordinate in issue comments
    -   Split into separate issues
    -   Pair program

-   Parent branch changed significantly?
    -   Rebase your branch
    -   Update tests
    -   Re-review if needed

## Testing

### Test Before Merging

**Unit Tests**:

```bash
# Run tests locally
npm test

# Watch mode during development
npm test -- --watch
```

**Integration Tests**:

```bash
npm run test:integration
```

**Manual Testing**:

-   Test in development environment
-   Verify acceptance criteria
-   Test edge cases
-   Check responsive design (if UI)

### CI/CD Integration

Add automated testing to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - name: Install dependencies
              run: npm install
            - name: Run tests
              run: npm test
            - name: Run linter
              run: npm run lint
```

## Documentation

### Keep Documentation Updated

**When to update docs**:

-   Adding new features
-   Changing APIs
-   Modifying workflows
-   Adding dependencies
-   Changing configuration

**What to document**:

-   Public APIs
-   Configuration options
-   Setup instructions
-   Usage examples
-   Architecture decisions

### Documentation Locations

-   `README.md` - Project overview and quick links
-   `docs/` - Detailed documentation
    -   `architecture.md` - System design
    -   `versioning.md` - Version management
    -   `quick-start.md` - Getting started
    -   `contributing.md` - Workflow guide
    -   `setup.md` - Configuration guide
-   Code comments - Inline documentation
-   Issue templates - Standardized forms

## Emergency Procedures

### Production Hotfixes

For critical production issues:

1. **Create hotfix issue immediately**

    ```
    Title: [Hotfix]: Critical security patch
    Parent: Bug issue or "main" for emergency
    ```

2. **Workflow creates branch from parent**

3. **Fix the issue quickly**

    ```bash
    git checkout hotfix/50-security-patch
    # Make minimal, focused fix
    git commit -m "fix: patch security vulnerability"
    git push origin hotfix/50-security-patch
    ```

4. **Get expedited review**

    - Tag on-call reviewers
    - Explain urgency in PR
    - Get approval ASAP

5. **Merge and deploy**
    - Version bumps automatically with letter
    - Deploy immediately
    - Monitor for issues

### Rollback Procedures

If a merge causes issues:

```bash
# Revert the merge commit on main
git checkout main
git revert -m 1 <merge-commit-hash>
git push origin main

# Or reset if not yet pushed downstream
git reset --hard <commit-before-merge>
git push --force origin main  # Use with extreme caution!
```

## Anti-Patterns to Avoid

### Don't:

❌ **Create manual branches without follow-up**

```bash
# DON'T (create branch and forget)
git checkout -b my-feature
# ... work ...
# ... merge without issue/proper labels

# DO (manual branch with proper follow-up)
git checkout -b feature/my-feature
# ... work ...
# Then: Create issue, PR with label, reference issue
```

❌ **Push directly to main**

```bash
# DON'T
git push origin main

# DO
# Work in feature branch, merge via PR
```

❌ **Merge without testing**

```bash
# DON'T
# Click merge immediately

# DO
# Run tests, request review, then merge
```

❌ **Skip parent issue numbers**

```
# DON'T
Parent Issue Number: N/A

# DO
Parent Issue Number: 42
```

❌ **Force push shared branches**

```bash
# DON'T (on shared branch)
git push --force origin main

# DO
git push --force-with-lease origin my-feature-branch
```

❌ **Mix unrelated changes**

```bash
# DON'T
git commit -m "Add login, fix typo, update docs, refactor utils"

# DO
# Separate commits for each concern
```

## Tips for Efficiency

### Use Aliases

Add to `.gitconfig`:

```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
```

### GitHub CLI Shortcuts

```bash
# View issues
gh issue list

# Create issue
gh issue create --label feature --title "[Feature]: Add widget"

# View PRs
gh pr list

# Checkout PR locally
gh pr checkout 42

# View workflow runs
gh run list
```

### VS Code Integration

Install extensions:

-   GitHub Pull Requests and Issues
-   GitLens
-   Git Graph

### Scripts and Tools

Create helper scripts in `scripts/`:

```bash
# scripts/new-feature.sh
#!/bin/bash
echo "Creating feature issue..."
gh issue create --label feature --title "$1"
```

## Maintenance

### Regular Tasks

**Weekly**:

-   Review open issues
-   Close stale branches
-   Update dependencies
-   Check for workflow failures

**Monthly**:

-   Review and update documentation
-   Audit branch protection rules
-   Check automation efficiency
-   Team retrospective on workflow

**Quarterly**:

-   Major version planning
-   Workflow improvements
-   Template updates
-   Training for new team members

### Monitoring

Track these metrics:

-   Average PR merge time
-   Number of workflow failures
-   Branch lifecycle duration
-   Version bump accuracy
-   Test coverage trends

---

**Following these practices will help your team work efficiently with the Issue-Driven Hierarchy workflow.**
