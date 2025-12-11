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
  // Safe GTK widget properties
  visible?: boolean
  sensitive?: boolean
  canFocus?: boolean
  canTarget?: boolean
  focusOnClick?: boolean
  focusable?: boolean
  hasTooltip?: boolean
  tooltipText?: string
  tooltipMarkup?: string
  halign?: Gtk.Align
  valign?: Gtk.Align
  hexpand?: boolean
  vexpand?: boolean
  hexpandSet?: boolean
  vexpandSet?: boolean
  marginStart?: number
  marginEnd?: number
  marginTop?: number
  marginBottom?: number
  widthRequest?: number
  heightRequest?: number
  name?: string
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
  visible,
  sensitive,
  canFocus,
  canTarget,
  focusOnClick,
  focusable,
  hasTooltip,
  tooltipText,
  tooltipMarkup,
  halign,
  valign,
  hexpand,
  vexpand,
  hexpandSet,
  vexpandSet,
  marginStart,
  marginEnd,
  marginTop,
  marginBottom,
  widthRequest,
  heightRequest,
  name,
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
        drawTriangle(cr, h, index, startUpright, units)
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

  // Apply safe widget properties to a helper function
  const applySafeProps = (widget: any) => {
    if (visible !== undefined) widget.visible = visible
    if (sensitive !== undefined) widget.sensitive = sensitive
    if (canFocus !== undefined) widget.can_focus = canFocus
    if (canTarget !== undefined) widget.can_target = canTarget
    if (focusOnClick !== undefined) widget.focus_on_click = focusOnClick
    if (focusable !== undefined) widget.focusable = focusable
    if (hasTooltip !== undefined) widget.has_tooltip = hasTooltip
    if (tooltipText !== undefined) widget.tooltip_text = tooltipText
    if (tooltipMarkup !== undefined) widget.tooltip_markup = tooltipMarkup
    if (halign !== undefined) widget.halign = halign
    if (valign !== undefined) widget.valign = valign
    if (hexpand !== undefined) widget.hexpand = hexpand
    if (vexpand !== undefined) widget.vexpand = vexpand
    if (hexpandSet !== undefined) widget.hexpand_set = hexpandSet
    if (vexpandSet !== undefined) widget.vexpand_set = vexpandSet
    if (marginStart !== undefined) widget.margin_start = marginStart
    if (marginEnd !== undefined) widget.margin_end = marginEnd
    if (marginTop !== undefined) widget.margin_top = marginTop
    if (marginBottom !== undefined) widget.margin_bottom = marginBottom
    if (widthRequest !== undefined) widget.width_request = widthRequest
    if (heightRequest !== undefined) widget.height_request = heightRequest
    if (name !== undefined) widget.name = name
  }

  // If no children, return just the DrawingArea
  if (!children) {
    if (className) drawingArea.add_css_class(className)
    if (css) (drawingArea as any).css = css
    applySafeProps(drawingArea)
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
  applySafeProps(overlay)

  return overlay as any
}
