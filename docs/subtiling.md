# Subtiling System

The subtiling system adds internal geometric detail to the base tiles. Instead of a plain trapezoid, each unit can be visually divided into smaller equilateral triangles.

## Geometry

A single "Unit" (trapezoid) is geometrically composed of 3 equilateral triangles.

- **Width**: `3 * SLANT` (where `SLANT = SIDE_LENGTH / 2`).
- **Height**: `TILE_HEIGHT`.

When `drawSubtileBoundaries` is called, it draws the internal edges between these triangles, creating a mesh-like effect.

## Implementation Details

The logic is handled in `lib/drawing.ts` via the `drawSubtileBoundaries` function.

### Parameters

- `cr`: The Cairo context.
- `height`: The height of the tile.
- `units`: The number of units in the module.
- `startUpright`: The parity of the starting tile.

### Logic

1.  **Total Triangles**: The total number of subtiles (triangles) is `3 * units`.
2.  **Step Size**: The horizontal distance between vertices is `SLANT`.
3.  **Skipping Boundaries**: The function iterates through all potential vertical lines but skips the lines that correspond to the boundaries between Units (indices `3k + 1`). This ensures that we only draw the _internal_ structure of the unit.

### Visual Representation

For a single unit (3 triangles):

- Triangle 1
- Triangle 2
- Triangle 3

The function draws the lines separating T1|T2 and T2|T3.

## Usage

This function is intended to be called within a widget's draw function to stroke the internal lines. It does not fill the shapes, only draws the paths.
