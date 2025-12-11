import { Gtk, Gdk } from "ags/gtk4"
import {
  drawPolyTile,
  drawSubtileBoundaries,
  drawTriangle,
  getPolyTileWidth,
  TILE_HEIGHT,
} from "../lib/drawing"

interface TileProps {
  units: number
  offset?: number
  subtiles?: Record<number, string>
  baseColor?: string
  showGrid?: boolean
  children?: any
  className?: string
  css?: string
  [key: string]: any
}

export default function Tile({
  units,
  offset = 0,
  subtiles = {},
  baseColor = "rgba(50, 50, 50, 1)",
  showGrid = false,
  children,
  className,
  css,
  ...props
}: TileProps) {
  const width = getPolyTileWidth(units)
  const startUpright = offset % 2 === 0

  // Create DrawingArea
  const drawingArea = new Gtk.DrawingArea()
  drawingArea.set_content_width(width)
  drawingArea.set_content_height(TILE_HEIGHT)

  drawingArea.set_draw_func((_, cr, w, h) => {
    // Base Shape
    const bg = new Gdk.RGBA()
    if (bg.parse(baseColor)) {
      cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha)
    } else {
      print(`[Tile] Failed to parse baseColor: ${baseColor}`)
      cr.setSourceRGBA(0.2, 0.2, 0.2, 1)
    }
    drawPolyTile(cr, w, h, units, startUpright)
    cr.fill()

    // Subtiles
    for (const [indexStr, colorStr] of Object.entries(subtiles)) {
      const index = parseInt(indexStr)
      const color = new Gdk.RGBA()
      if (color.parse(colorStr)) {
        cr.setSourceRGBA(color.red, color.green, color.blue, color.alpha)
        drawTriangle(cr, h, index, startUpright)
        cr.fill()
      }
    }

    // Grid
    if (showGrid) {
      cr.setSourceRGBA(0, 0, 0, 0.5)
      cr.setLineWidth(1)
      drawSubtileBoundaries(cr, h, units, startUpright)
      cr.stroke()
    }
  })

  // If no children, return just the DrawingArea
  if (!children) {
    if (className) drawingArea.add_css_class(className)
    if (css) (drawingArea as any).css = css
    // Apply additional props
    Object.assign(drawingArea, props)
    return drawingArea as any
  }

  // Create Overlay for children
  const overlay = new Gtk.Overlay()
  overlay.set_child(drawingArea)

  const overlayBox = (
    <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
      {children}
    </box>
  ) as Gtk.Widget
  overlay.add_overlay(overlayBox)

  // Apply props
  if (className) overlay.add_css_class(className)
  if (css) (overlay as any).css = css
  // Apply additional props
  Object.assign(overlay, props)

  return overlay as any
}
