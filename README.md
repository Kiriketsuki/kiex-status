# kiex-status

A modular, geometric status bar built with [AGS (Aylur's GTK Shell)](https://github.com/Aylur/ags). This project implements a unique "interlocking tile" architecture where modules are rendered as alternating trapezoids that fit together visually.

## Features

-   **Geometric Design**: Uses Cairo drawing to create interlocking trapezoidal tiles.
-   **Modular Architecture**: "Base Tile" system allows modules to consume multiple "units" of space.
-   **Dynamic Parity**: Tiles automatically adjust their shape (Upright `/ \` vs Inverted `\ /`) based on their position in the bar.
-   **Customizable**: Built with standard CSS (SCSS) and JavaScript/GJS.

## Prerequisites

To use this configuration, you need:

-   **AGS**: Aylur's GTK Shell
-   **GJS**: GNOME JavaScript bindings
-   **GTK3**: The GTK toolkit
-   **Node.js & npm**: For managing TypeScript definitions and development tools.

## Installation

### 1. Clone or Initialize

If setting up from scratch:

```bash
mkdir kiex-status
cd kiex-status
git init
```

Or add as a submodule to your dotfiles:

```bash
git submodule add ./path/to/kiex-status
```

### 2. Install Dependencies

**Arch Linux:**

```bash
yay -S ags-hyprland-git
npm install
```

**Ubuntu/Debian:**
Ensure `gjs`, `gtk3`, and `gtk-layer-shell` are installed, then install AGS.

### 3. Setup TypeScript (Optional but Recommended)

Initialize the project to get IntelliSense support:

```bash
npm init -y
npm install -D ags-types
```

## Architecture

### The "Base Tile" System

The bar is composed of independent modules, each drawn as a sequence of interlocking trapezoids.

-   **Unit**: The width of a single trapezoid.
-   **Parity**: Local to the module. Controlled by an `offset` parameter.
-   **Module Size**: Modules can consume $N$ units.

### Visual Logic

-   **Offset 0 (Even)**: Starts with Upright Trapezoid `/ \`
-   **Offset 1 (Odd)**: Starts with Inverted Trapezoid `\ /`
-   **Combined**: A module consuming 2 units with `offset: 0` draws Upright -> Inverted.

## Directory Structure

```
kiex-status/
├── config.js          # Entry point
├── style.scss         # Styles
├── lib/
│   ├── drawing.js     # Cairo drawing logic
│   └── tile.js        # The Base Tile component
└── modules/
    ├── clock.js
    └── workspaces.js
```

## Usage

Run AGS pointing to this configuration directory:

```bash
ags -c /path/to/kiex-status/config.js
```
