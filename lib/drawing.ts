import Cairo from "cairo"

export const TILE_HEIGHT = 40
export const TILE_WIDTH = 60
export const SLANT = 20

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
  // The top edge length depends on the sequence of tiles.
  // However, for a solid block, we just need the final X coordinate.

  const finalIsUpright = units % 2 === 0 ? !startUpright : startUpright

  // If the last tile is Upright, the top-right corner is "inwards" by SLANT relative to bottom-right
  // If the last tile is Inverted, the top-right corner is the extreme edge.

  cr.lineTo(width - (finalIsUpright ? SLANT : 0), 0) // Top Right
  cr.lineTo(width - (finalIsUpright ? 0 : SLANT), height) // Bottom Right
  cr.lineTo(xBottom, height) // Close loop
}
