# kiex-status Copilot Instructions

You are working on `kiex-status`, a geometric status bar built with **AGS (Aylur's GTK Shell)**, **GJS (GNOME JavaScript)**, and **GTK3**.

## Core Architecture: The "Base Tile" System

The project implements a unique "interlocking tile" visual system using Cairo drawing.

-   **Concept**: The bar is composed of independent modules, each drawn as a sequence of interlocking trapezoids.
-   **Parity & Offset**:
    -   Parity is **local to the module**, not global to the bar.
    -   Modules accept an `offset` (or `startParity`) parameter to determine their starting shape.
    -   **Offset 0 (Even)**: Starts with Upright Trapezoid (`/ \`).
    -   **Offset 1 (Odd)**: Starts with Inverted Trapezoid (`\ /`).
    -   _Example_: Two adjacent 2-unit modules can both be configured to start with an Upright trapezoid.
-   **Modules**: Widgets consume $N$ "units" of space.
    -   A 2-unit module with `offset: 0` draws: Upright (`/ \`) -> Inverted (`\ /`).

## Directory Structure & Key Files

-   `config.js`: **Entry Point**. Exports the AGS configuration object.
-   `lib/drawing.js`: **Critical**. Handles all Cairo drawing logic. Defines `TILE_HEIGHT`, `TILE_WIDTH`, and `SLANT`.
    -   **Best Practice**: Keep drawing functions pure and well-documented. Use helpers like `drawTrapezoid(cr, x, y, isUpright)`.
-   `lib/tile.js`: Component wrapper that applies the geometric shape to content.
-   `modules/*.js`: Individual status bar widgets (Clock, Workspaces).
-   `style.scss`: SCSS entry point for GTK styling.

## Development Patterns

### 1. Creating Modules

-   Modules should be wrapped in the `Tile` component from `lib/tile.js`.
-   Define:
    -   `units`: Width in base tiles.
    -   `offset`: Starting parity (0 or 1).
-   Content inside the tile must respect the trapezoidal boundaries (avoid placing text in the slanted edges).

### 2. Cairo Drawing (`lib/drawing.js`)

-   Use `Cairo.Context` for custom drawing.
-   Shapes are calculated dynamically based on `units` and `offset`.
-   **Do not hardcode pixel values** inside modules; use the constants exported from `drawing.js`.
-   Since Cairo can be complex, prioritize readability and modularity in drawing code.

### 3. AGS & GJS Specifics

-   **Reactivity**: Use `Variable()` for state (e.g., `const time = Variable('', { poll: [1000, 'date'] })`).
-   **Widgets**: Import from `resource:///com/github/Aylur/ags/widget.js` or the global `Widget`.
-   **Async**: Use `Utils.execAsync([])` for shell commands. Avoid blocking calls.

## Style Guidelines

-   Use **SCSS** for styling.
-   Class names should follow kebab-case (e.g., `.clock-widget`).
-   The geometric background is drawn via Cairo, but colors/fonts are handled in CSS.

## Build & Run

-   Run with: `ags -c /absolute/path/to/config.js`
-   Reload config: `ags -q; ags -c ...` or use the AGS inspector.

## Git Workflow & Versioning

-   **Versioning**: 4-digit system (`Major.Minor.Patch.Hotfix`) stored in `VERSION`.
-   **Branches**:
    -   `main`: Development (PR target for features).
    -   `release`: Production (PR target for releases).
    -   `feat/*`, `bug/*`, `task/*`: Feature branches.
-   **Release Process**:
    1. PR `main` -> `release`.
    2. Merge triggers automatic version bump (Patch) and GitHub Release.
