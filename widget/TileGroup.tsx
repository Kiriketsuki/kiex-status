import { Gtk } from "ags/gtk4"

interface TileGroupProps {
  tiles: any[]
  overlay?: any
  spacing?: number
  className?: string
  css?: string
}

/**
 * TileGroup: Wraps multiple Tile components and provides a unified overlay
 * that can span across all tiles in the group.
 *
 * @example
 * <TileGroup
 *   tiles={[
 *     <Tile units={2} offset={0} baseColor="blue" />,
 *     <Tile units={2} offset={1} baseColor="green" />
 *   ]}
 *   overlay={
 *     <label label="Spans Both Tiles"
 *       halign={Gtk.Align.CENTER}
 *       valign={Gtk.Align.CENTER}
 *     />
 *   }
 *   spacing={0}
 * />
 */
export default function TileGroup({
  tiles,
  overlay,
  spacing = 0,
  className,
  css,
}: TileGroupProps) {
  // Create box to hold tiles (no children inside tiles themselves)
  const tilesBox = (<box spacing={spacing}>{tiles}</box>) as Gtk.Widget

  // If no overlay, just return the box
  if (!overlay) {
    if (className) tilesBox.add_css_class(className)
    if (css) (tilesBox as any).css = css
    return tilesBox as any
  }

  // Create overlay container
  const overlayContainer = new Gtk.Overlay()
  overlayContainer.set_child(tilesBox)

  // Add the overlay widget with proper alignment
  const overlayWidget = (
    <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
      {overlay}
    </box>
  ) as Gtk.Widget
  overlayContainer.add_overlay(overlayWidget)

  // Apply props
  if (className) overlayContainer.add_css_class(className)
  if (css) (overlayContainer as any).css = css

  return overlayContainer as any
}
