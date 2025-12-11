#!/bin/bash

# Template Setup Script
# This script automates the initial customization of the Issue-Driven Hierarchy template

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Issue-Driven Hierarchy Template Setup Script       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local result
    
    read -p "$(echo -e ${GREEN}${prompt}${NC} [${YELLOW}${default}${NC}]): " result
    echo "${result:-$default}"
}

# Function to prompt for yes/no
prompt_yes_no() {
    local prompt="$1"
    local default="$2"
    local result
    
    while true; do
        read -p "$(echo -e ${GREEN}${prompt}${NC} [${YELLOW}${default}${NC}]): " result
        result="${result:-$default}"
        case "$result" in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# Validate we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: Not a git repository!${NC}"
    echo "Please run this script from the root of a git repository."
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠ Warning: You have uncommitted changes.${NC}"
    if ! prompt_yes_no "Continue anyway?" "n"; then
        echo -e "${RED}Aborted by user${NC}"
        exit 1
    fi
fi

# Validate required files exist
echo -e "${BLUE}=== Validating repository structure ===${NC}"
REQUIRED_FILES=("VERSION" "package.json" ".github/settings.yml" ".github/copilot-instructions.md")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${RED}✗ Error: Missing required files:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "This script must be run from the template-repo root directory."
    exit 1
fi

echo -e "${GREEN}✓${NC} All required files found"
echo ""

echo -e "${YELLOW}This script will help you customize the template for your project.${NC}"
echo ""

# Gather information
echo -e "${BLUE}=== Project Information ===${NC}"
PROJECT_NAME=$(prompt_with_default "Project name" "my-awesome-project")
PROJECT_DESCRIPTION=$(prompt_with_default "Project description" "An awesome project using Issue-Driven Hierarchy")
AUTHOR_NAME=$(prompt_with_default "Author name" "$(git config user.name 2>/dev/null || echo 'Your Name')")
AUTHOR_EMAIL=$(prompt_with_default "Author email" "$(git config user.email 2>/dev/null || echo 'your.email@example.com')")
GITHUB_USERNAME=$(prompt_with_default "GitHub username/org" "$(git remote get-url origin 2>/dev/null | sed -n 's#.*github.com[:/]\([^/]*\)/.*#\1#p' || echo 'yourusername')")

echo ""
echo -e "${BLUE}=== Repository URLs ===${NC}"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}.git"
BUGS_URL="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}/issues"
HOMEPAGE_URL="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}#readme"

echo "Repository URL: ${REPO_URL}"
echo "Issues URL: ${BUGS_URL}"
echo "Homepage URL: ${HOMEPAGE_URL}"
echo ""

if ! prompt_yes_no "Does this look correct?" "y"; then
    echo -e "${RED}Aborted by user${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}=== Updating Files ===${NC}"

# Backup original files
echo -e "${YELLOW}Creating backups...${NC}"
cp package.json package.json.bak 2>/dev/null || true
cp README.md README.md.bak 2>/dev/null || true
cp .github/settings.yml .github/settings.yml.bak 2>/dev/null || true

# Update package.json
echo -e "${GREEN}✓${NC} Updating package.json..."
if command -v jq &> /dev/null; then
    jq --arg name "$PROJECT_NAME" \
       --arg desc "$PROJECT_DESCRIPTION" \
       --arg author "$AUTHOR_NAME <$AUTHOR_EMAIL>" \
       --arg url "$REPO_URL" \
       --arg bugs "$BUGS_URL" \
       --arg home "$HOMEPAGE_URL" \
       '.name = $name | .description = $desc | .author = $author | .repository.url = $url | .bugs.url = $bugs | .homepage = $home' \
       package.json > package.json.tmp && mv package.json.tmp package.json
else
    echo -e "${YELLOW}⚠${NC} jq not found, please update package.json manually"
fi

# Update .github/settings.yml
echo -e "${GREEN}✓${NC} Updating .github/settings.yml..."
sed -e "s|name: your-project-name|name: $PROJECT_NAME|" \
    -e "s|description: Your project description|description: $PROJECT_DESCRIPTION|" \
    -e "s|homepage: https://github.com/yourusername/your-project-name|homepage: $HOMEPAGE_URL|" \
    .github/settings.yml > .github/settings.yml.tmp && mv .github/settings.yml.tmp .github/settings.yml

# Update .github/copilot-instructions.md
echo -e "${GREEN}✓${NC} Updating .github/copilot-instructions.md..."
sed -e "s|template-repo|$PROJECT_NAME|g" \
    -e "s|Template-Repo|$PROJECT_NAME|g" \
    .github/copilot-instructions.md > .github/copilot-instructions.md.tmp && mv .github/copilot-instructions.md.tmp .github/copilot-instructions.md

# Create project-specific README
echo -e "${GREEN}✓${NC} Creating PROJECT_README.md template..."
cat > PROJECT_README.md << EOF
# $PROJECT_NAME

$PROJECT_DESCRIPTION

## 🚀 Getting Started

[Add your project-specific instructions here]

## 📖 Documentation

[Link to your documentation]

## 🏗 Development Workflow

This project uses the Issue-Driven Hierarchy workflow. See [WORKFLOW.md](WORKFLOW.md) for details.

## 🤝 Contributing

See [CONTRIBUTING.md](docs/contributing.md) for contribution guidelines.

## 📄 License

[Add your license information]

## 👥 Authors

- $AUTHOR_NAME <$AUTHOR_EMAIL>

EOF

# Rename template README for reference
if [ -f README.md ]; then
    echo -e "${GREEN}✓${NC} Preserving template README as WORKFLOW.md..."
    mv README.md WORKFLOW.md
fi

# Make the new README the main one
echo -e "${GREEN}✓${NC} Setting PROJECT_README.md as main README..."
mv PROJECT_README.md README.md

# Validate VERSION file format
echo -e "${GREEN}✓${NC} Validating VERSION file..."
VERSION_CONTENT=$(cat VERSION)
if [[ ! "$VERSION_CONTENT" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+([a-z])?$ ]]; then
    echo -e "${YELLOW}⚠ Warning: VERSION file has unexpected format: $VERSION_CONTENT${NC}"
    echo "Expected format: Major.Task.Feature.Bug[a-z] (e.g., 0.1.0.0 or 0.1.0.0a)"
    if prompt_yes_no "Reset VERSION to 0.1.0.0?" "y"; then
        echo "0.1.0.0" > VERSION
        jq '.version = "0.1.0.0"' package.json > package.json.tmp && mv package.json.tmp package.json
        echo -e "${GREEN}✓${NC} VERSION reset to 0.1.0.0"
    fi
else
    echo -e "${GREEN}✓${NC} VERSION format valid: $VERSION_CONTENT"
fi

# Clean up template-specific files (optional)
echo ""
if prompt_yes_no "Remove SETUP.md (no longer needed after setup)?" "y"; then
    rm -f SETUP.md
    echo -e "${GREEN}✓${NC} Removed SETUP.md"
fi

# Install git hooks
echo ""
echo -e "${BLUE}=== Git Hooks Installation ===${NC}"
if prompt_yes_no "Install pre-commit hook to validate VERSION/package.json sync?" "y"; then
    if [ -f scripts/pre-commit.sh ]; then
        mkdir -p .git/hooks
        ln -sf ../../scripts/pre-commit.sh .git/hooks/pre-commit
        chmod +x scripts/pre-commit.sh
        chmod +x .git/hooks/pre-commit
        echo -e "${GREEN}✓${NC} Pre-commit hook installed"
        echo "   The hook will validate VERSION and package.json are in sync before commits"
    else
        echo -e "${YELLOW}⚠${NC} scripts/pre-commit.sh not found, skipping"
    fi
fi

echo ""
echo -e "${BLUE}=== Git Configuration ===${NC}"

if prompt_yes_no "Update git remote URL?" "n"; then
    echo "Current remote:"
    git remote -v
    NEW_REMOTE=$(prompt_with_default "New remote URL" "$REPO_URL")
    git remote set-url origin "$NEW_REMOTE"
    echo -e "${GREEN}✓${NC} Updated remote URL"
fi

echo ""
echo -e "${BLUE}=== Next Steps ===${NC}"
echo ""
echo -e "1. ${YELLOW}Review and commit the changes:${NC}"
echo "   git add ."
echo "   git commit -m 'chore: customize template for $PROJECT_NAME'"
echo "   git push origin main"
echo ""
echo -e "2. ${YELLOW}Configure GitHub repository:${NC}"
echo "   • Create required labels (run label-sync workflow or use gh CLI)"
echo "   • Enable branch protection for main"
echo "   • Configure Actions permissions"
echo "   • See WORKFLOW.md for detailed setup instructions"
echo ""
echo -e "3. ${YELLOW}Create labels quickly:${NC}"
echo "   gh label create task --color '0052CC' --description 'Major unit of work'"
echo "   gh label create feature --color '1D76DB' --description 'Sub-component of a task'"
echo "   gh label create bug --color 'D73A4A' --description 'Fix for a feature or task'"
echo "   gh label create hotfix --color 'B60205' --description 'Urgent production fix'"
echo "   gh label create implementation --color '5319E7' --description 'Implementation of a new task'"
echo "   gh label create addition --color '0E8A16' --description 'Addition of a new feature'"
echo "   gh label create fix --color 'D93F0B' --description 'Bug fix or correction'"
echo ""
echo -e "   ${YELLOW}Or trigger the label-sync workflow:${NC}"
echo "   Go to Actions → Validate Required Labels → Run workflow"
echo ""
echo -e "4. ${YELLOW}Customize your project:${NC}"
echo "   • Edit README.md with your project details"
echo "   • Update LICENSE file"
echo "   • Add your project files"
echo ""
echo -e "5. ${YELLOW}Start developing:${NC}"
echo "   • Create your first Task issue"
echo "   • Let automation create the branch"
echo "   • Begin coding!"
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup complete! Happy coding! 🚀                    ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
