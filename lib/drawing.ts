import Cairo from "cairo"

export const SIDE_LENGTH = 40
export const TILE_HEIGHT = (SIDE_LENGTH * Math.sqrt(3)) / 2
export const SLANT = SIDE_LENGTH / 2
export const TILE_WIDTH = SIDE_LENGTH // Flat top width of a single upright trapezoid (equals SIDE_LENGTH)

/**
 * Calculates the total width for a poly tile with N units.
 * Formula: S * (1 + 3N) / 2
 */
export function getPolyTileWidth(units: number): number {
  return (SIDE_LENGTH * (1 + 3 * units)) / 2
}

/**
 * Draws a shape composed of N interlocking tiles.
 * @param cr - The drawing context
 * @param width - Total widget width
 * @param height - Total widget height
 * @param units - How many tiles this shape consumes
 * @param startUpright - True if the first tile is Upright ( / \ ), False if Inverted ( \ / )
 */
export function drawPolyTile(
  cr: Cairo.Context,
  width: number,
  height: number,
  units: number,
  startUpright: boolean
) {
  // Starting coordinates
  // If Upright: Top starts at SLANT, Bottom starts at 0
  // If Inverted: Top starts at 0, Bottom starts at SLANT

  const xTop = startUpright ? SLANT : 0
  const xBottom = startUpright ? 0 : SLANT

  cr.moveTo(xBottom, height) // Start bottom-left
  cr.lineTo(xTop, 0) // Line to top-left

  // Draw Top Edge

  const finalIsUpright = units % 2 === 0 ? !startUpright : startUpright

  // If the last tile is Upright, the top-right corner is "inwards" by SLANT relative to bottom-right
  // If the last tile is Inverted, the top-right corner is the extreme edge.

  cr.lineTo(width - (finalIsUpright ? SLANT : 0), 0) // Top Right
  cr.lineTo(width - (finalIsUpright ? 0 : SLANT), height) // Bottom Right
  cr.lineTo(xBottom, height) // Close loop
}

/**
 * Draws the path for a single triangular subtile.
 * @param cr - The drawing context
 * @param height - Widget height
 * @param index - The 0-based index of the triangle (0 to 3N-1)
 * @param startUpright - True if the first tile is Upright
 * @param units - Total number of units (for bounds validation)
 */
export function drawTriangle(
  cr: Cairo.Context,
  height: number,
  index: number,
  startUpright: boolean,
  units?: number
) {
  // Validate index bounds if units is provided
  if (units !== undefined) {
    const maxIndex = 3 * units - 1
    if (index < 0 || index > maxIndex) {
      console.warn(
        `drawTriangle: index ${index} is out of bounds [0, ${maxIndex}] for ${units} units`
      )
      return
    }
  }

  const stepX = SLANT
  const x1 = index * stepX
  const x2 = (index + 1) * stepX
  const x3 = (index + 2) * stepX

  // Determine orientation of this specific triangle
  // If startUpright=true: 0 is Upright (/\), 1 is Inverted (\/)
  // If startUpright=false: 0 is Inverted (\/), 1 is Upright (/\)
  const isUprightTriangle = startUpright ? index % 2 === 0 : index % 2 !== 0

  if (isUprightTriangle) {
    // Upright / \ : Bottom-Left, Top-Center, Bottom-Right
    cr.moveTo(x1, height)
    cr.lineTo(x2, 0)
    cr.lineTo(x3, height)
  } else {
    // Inverted \ / : Top-Left, Bottom-Center, Top-Right
    cr.moveTo(x1, 0)
    cr.lineTo(x2, height)
    cr.lineTo(x3, 0)
  }
  cr.closePath()
}

/**
 * Draws the dividing lines between subtiles (equilateral triangles) within a unit.
 * Excludes the boundaries between units and the outer edges.
 */
export function drawSubtileBoundaries(
  cr: Cairo.Context,
  height: number,
  units: number,
  startUpright: boolean
) {
  const numTriangles = 3 * units
  const stepX = SLANT

  for (let i = 2; i <= numTriangles; i++) {
    // i is the index of the line segment (1-based)
    // Line 1 is Left Edge. Line 3N + 1 is Right Edge.
    // Unit boundaries are at i = 3k + 1 (4, 7, 10...)

    if (i % 3 !== 1) {
      const xStart = (i - 1) * stepX
      const xEnd = i * stepX

      // Determine Y coordinates
      // If startUpright: Y0=H, Y1=0, Y2=H...
      // Y_index = (index % 2 === 0) ? H : 0 (if startUpright)

      const yStart = startUpright
        ? (i - 1) % 2 === 0
          ? height
          : 0
        : (i - 1) % 2 === 0
        ? 0
        : height
      const yEnd = startUpright
        ? i % 2 === 0
          ? height
          : 0
        : i % 2 === 0
        ? 0
        : height

      cr.moveTo(xStart, yStart)
      cr.lineTo(xEnd, yEnd)
    }
  }
}

/**
 * Draws the dividing lines between units (trapeziums).
 */
export function drawUnitBoundaries(
  cr: Cairo.Context,
  height: number,
  units: number,
  startUpright: boolean
) {
  const numTriangles = 3 * units
  const stepX = SLANT

  for (let i = 2; i <= numTriangles; i++) {
    if (i % 3 === 1) {
      const xStart = (i - 1) * stepX
      const xEnd = i * stepX

      const yStart = startUpright
        ? (i - 1) % 2 === 0
          ? height
          : 0
        : (i - 1) % 2 === 0
        ? 0
        : height
      const yEnd = startUpright
        ? i % 2 === 0
          ? height
          : 0
        : i % 2 === 0
        ? 0
        : height

      cr.moveTo(xStart, yStart)
      cr.lineTo(xEnd, yEnd)
    }
  }
}
