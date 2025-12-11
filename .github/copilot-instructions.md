# kiex-status Copilot Instructions

You are working on `kiex-status`, a geometric status bar built with **AGS (Astal)**, **TypeScript**, and **GTK4**.

## Core Architecture: The "Base Tile" System

The project implements a unique "interlocking tile" visual system using Cairo drawing.

- **Concept**: The bar is composed of independent modules, each drawn as a sequence of interlocking trapezoids.
- **Parity & Offset**:
  - Parity is **local to the module**, not global to the bar.
  - Modules accept an `offset` (or `startParity`) parameter to determine their starting shape.
  - **Offset 0 (Even)**: Starts with Upright Trapezoid (`/ \`).
  - **Offset 1 (Odd)**: Starts with Inverted Trapezoid (`\ /`).
  - _Example_: Two adjacent 2-unit modules can both be configured to start with an Upright trapezoid.
- **Modules**: Widgets consume $N$ "units" of space.
  - A 2-unit module with `offset: 0` draws: Upright (`/ \`) -> Inverted (`\ /`).

## Directory Structure & Key Files

- `app.ts`: **Entry Point**. Initializes the AGS application.
- `lib/drawing.ts`: **Critical**. Handles all Cairo drawing logic. Defines `TILE_HEIGHT`, `SIDE_LENGTH`, and `SLANT`.
  - **Best Practice**: Keep drawing functions pure and well-documented. Use helpers like `drawPolyTile(...)`.
- `widget/`: Contains UI components and widgets (e.g., `Bar.tsx`).
- `style.scss`: SCSS entry point for GTK styling.

## Development Patterns

### 1. Creating Modules

- Use **TypeScript** and **TSX** for components.
- Modules should be functional components.
- Define:
  - `units`: Width in base tiles.
  - `offset`: Starting parity (0 or 1).
- Content inside the tile must respect the trapezoidal boundaries.

### TypeScript Guidelines

- **Type Safety**: Prefer specific types over `any` when practical.
- **`any` is acceptable** in the following cases:
  - **GTK/AGS Widget Interop**: When dealing with AGS widget children, GTK widget properties, or Cairo contexts where the framework's type system is incomplete or overly complex.
  - **Dynamic Widget Trees**: For `children` props that accept mixed GTK widgets, TSX elements, or dynamic content.
  - **Third-party Library Gaps**: When AGS/GTK type definitions are incomplete or incorrect.
- **When to avoid `any`**:
  - Internal application logic and business code.
  - Data structures and models.
  - Function parameters with known types.
- Use explicit return types for exported functions to maintain type safety at API boundaries.

### 2. Cairo Drawing (`lib/drawing.ts`)

- Use `Cairo.Context` for custom drawing.
- Shapes are calculated dynamically based on `units` and `offset`.
- **Do not hardcode pixel values** inside modules; use the constants exported from `drawing.ts`.
- Since Cairo can be complex, prioritize readability and modularity in drawing code.

### 3. AGS & Astal Specifics

- **Framework**: This project uses **AGS (Astal)** with **GTK4**.
- **Reactivity**: Use `createPoll` or `Variable` for state (e.g., `const time = createPoll("", 1000, "date")`).
- **Widgets**: Import from `ags/gtk4` (e.g., `import { Astal, Gtk, Gdk } from "ags/gtk4"`).
- **Async**: Use `execAsync` from `ags/process` for shell commands.

## Style Guidelines

- Use **SCSS** for styling.
- Class names should follow kebab-case (e.g., `.clock-widget`).
- The geometric background is drawn via Cairo, but colors/fonts are handled in CSS.

## Build & Run

- Run with: `npm start` or `ags run app.ts`
- Reload: `ags quit; npm start` (or use development mode if available).

## Git Workflow & Versioning

- **Versioning**: 5-part versioning system (`Release.Major.Minor.Patch[Hotfix]`) stored in `VERSION`.
- **Branches**:
  - `main`: Development (PR target for features).
  - `release`: Production (PR target for releases).
  - `feat/*`, `bug/*`, `task/*`: Feature branches.
- **Rebasing**: Rebase feature branches onto `main` frequently and before merging to ensure the `VERSION` file and other changes are up-to-date.
- **Release Process**:
  1. PR `main` -> `release`.
  2. Merge triggers automatic version bump (Patch) and GitHub Release.
