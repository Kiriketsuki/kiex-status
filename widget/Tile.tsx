import { Gtk, Gdk } from "ags/gtk4"

import { getRandomPaletteEntry } from "../lib/palette"
import {
  drawPolyTile,
  drawSubtileBoundaries,
  drawTriangle,
  getPolyTileWidth,
  TILE_HEIGHT,
} from "../lib/drawing"

interface SafeWidgetProps {
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

/**
 * Applies safe GTK widget properties to a widget.
 * Helper function to set common widget properties without recreating on each render.
 */
function applySafeProps(widget: any, props: SafeWidgetProps) {
  if (props.visible !== undefined) widget.visible = props.visible
  if (props.sensitive !== undefined) widget.sensitive = props.sensitive
  if (props.canFocus !== undefined) widget.can_focus = props.canFocus
  if (props.canTarget !== undefined) widget.can_target = props.canTarget
  if (props.focusOnClick !== undefined)
    widget.focus_on_click = props.focusOnClick
  if (props.focusable !== undefined) widget.focusable = props.focusable
  if (props.hasTooltip !== undefined) widget.has_tooltip = props.hasTooltip
  if (props.tooltipText !== undefined) widget.tooltip_text = props.tooltipText
  if (props.tooltipMarkup !== undefined)
    widget.tooltip_markup = props.tooltipMarkup
  if (props.halign !== undefined) widget.halign = props.halign
  if (props.valign !== undefined) widget.valign = props.valign
  if (props.hexpand !== undefined) widget.hexpand = props.hexpand
  if (props.vexpand !== undefined) widget.vexpand = props.vexpand
  if (props.hexpandSet !== undefined) widget.hexpand_set = props.hexpandSet
  if (props.vexpandSet !== undefined) widget.vexpand_set = props.vexpandSet
  if (props.marginStart !== undefined) widget.margin_start = props.marginStart
  if (props.marginEnd !== undefined) widget.margin_end = props.marginEnd
  if (props.marginTop !== undefined) widget.margin_top = props.marginTop
  if (props.marginBottom !== undefined)
    widget.margin_bottom = props.marginBottom
  if (props.widthRequest !== undefined)
    widget.width_request = props.widthRequest
  if (props.heightRequest !== undefined)
    widget.height_request = props.heightRequest
  if (props.name !== undefined) widget.name = props.name
}

interface TileProps extends SafeWidgetProps {
  units: number
  offset?: number
  subtiles?: Record<number, string>
  baseColor?: string
  showGrid?: boolean
  children?: any
  className?: string
  css?: string
}

export default function Tile({
  units,
  offset = 0,
  subtiles = {},
  baseColor,
  showGrid = false,
  children,
  className,
  css,
  ...safeProps
}: TileProps) {
  const width = getPolyTileWidth(units)
  const startUpright = offset % 2 === 0

  const paletteEntry = getRandomPaletteEntry()
  const autoCss = paletteEntry ? `color: var(${paletteEntry.name});` : ""
  const finalCss = `${autoCss} ${css || ""}`.trim()

  const effectiveBaseColor = baseColor || paletteEntry?.value

  // Create DrawingArea
  const drawingArea = new Gtk.DrawingArea()
  drawingArea.set_content_width(width)
  drawingArea.set_content_height(TILE_HEIGHT)

  drawingArea.set_draw_func((_area: any, cr: any, w: number, h: number) => {
    // Base Shape
    if (effectiveBaseColor) {
      const bg = new Gdk.RGBA()
      if (bg.parse(effectiveBaseColor)) {
        cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha)
        drawPolyTile(cr, w, h, units, startUpright)
        cr.fill()
      } else {
        console.error(`[Tile] Failed to parse baseColor: ${effectiveBaseColor}`)
      }
    }

    // Subtiles
    for (const [indexStr, colorStr] of Object.entries(subtiles)) {
      const index = parseInt(indexStr)
      if (isNaN(index)) {
        console.error(`[Tile] Invalid subtile index: ${indexStr}`)
        continue
      }
      const color = new Gdk.RGBA()
      if (color.parse(colorStr)) {
        cr.setSourceRGBA(color.red, color.green, color.blue, color.alpha)
      } else {
        console.error(
          `[Tile] Failed to parse subtile color at index ${index}: ${colorStr}`
        )
        // Fallback: use baseColor
        const fallback = new Gdk.RGBA()
        if (fallback.parse(effectiveBaseColor)) {
          cr.setSourceRGBA(
            fallback.red,
            fallback.green,
            fallback.blue,
            fallback.alpha
          )
        } else {
          cr.setSourceRGBA(0.2, 0.2, 0.2, 1)
        }
      }
      drawTriangle(cr, h, index, startUpright, units)
      cr.fill()
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
    drawingArea.add_css_class("geo-tile")
    if (className) drawingArea.add_css_class(className)
    if (finalCss) (drawingArea as any).css = finalCss
    applySafeProps(drawingArea, safeProps)
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
  overlay.add_css_class("geo-tile")
  if (className) overlay.add_css_class(className)
  if (finalCss) (overlay as any).css = finalCss
  applySafeProps(overlay, safeProps)

  return overlay as any
}
