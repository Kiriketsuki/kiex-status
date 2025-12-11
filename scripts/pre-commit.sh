#!/bin/bash

# Pre-commit hook to validate VERSION and package.json are in sync
# Install this hook by copying it to .git/hooks/pre-commit
# Or use: ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if VERSION file exists
if [ ! -f VERSION ]; then
    echo -e "${RED}ERROR: VERSION file not found!${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f package.json ]; then
    echo -e "${RED}ERROR: package.json file not found!${NC}"
    exit 1
fi

# Get versions
VERSION_FILE=$(cat VERSION)
PACKAGE_VERSION=$(grep -o '"version": *"[^"]*"' package.json | sed 's/"version": *"\(.*\)"/\1/')

# Validate VERSION format
if ! [[ "$VERSION_FILE" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+([a-z])?$ ]]; then
    echo -e "${RED}ERROR: Invalid version format in VERSION file: $VERSION_FILE${NC}"
    echo -e "${YELLOW}Expected format: Major.Task.Feature.Bug[a-z] (e.g., 0.1.2.1 or 0.1.2.1a)${NC}"
    exit 1
fi

# Check if versions match
if [ "$VERSION_FILE" != "$PACKAGE_VERSION" ]; then
    echo -e "${RED}ERROR: Version mismatch detected!${NC}"
    echo -e "${RED}  VERSION file: $VERSION_FILE${NC}"
    echo -e "${RED}  package.json: $PACKAGE_VERSION${NC}"
    echo ""
    echo -e "${YELLOW}To fix, run one of these commands:${NC}"
    echo ""
    echo -e "  ${GREEN}# Sync package.json to VERSION file:${NC}"
    echo "  jq --arg v \"\$(cat VERSION)\" '.version = \$v' package.json > package.json.tmp && mv package.json.tmp package.json"
    echo ""
    echo -e "  ${GREEN}# Or sync VERSION to package.json:${NC}"
    echo "  jq -r '.version' package.json > VERSION"
    echo ""
    exit 1
fi

# Check for hotfix letter overflow warning
if [[ "$VERSION_FILE" =~ ([a-z])$ ]]; then
    HOTFIX_LETTER="${BASH_REMATCH[1]}"
    if [[ "$HOTFIX_LETTER" > "y" ]]; then
        echo -e "${YELLOW}WARNING: Hotfix letter is '$HOTFIX_LETTER'.${NC}"
        echo -e "${YELLOW}Consider bumping to next bug fix version instead of continuing past 'z'.${NC}"
    fi
fi

echo -e "${GREEN}✓ Version sync validated: $VERSION_FILE${NC}"
exit 0
