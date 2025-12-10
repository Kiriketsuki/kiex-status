import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import {
  drawPolyTile,
  drawSubtileBoundaries,
  drawUnitBoundaries,
  getPolyTileWidth,
  TILE_HEIGHT,
} from "../lib/drawing"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        <button
          $type="start"
          onClicked={() => execAsync("echo hello").then(console.log)}
          hexpand
          halign={Gtk.Align.CENTER}
        >
          <label label="Welcome to AGS!" />
        </button>
        <drawingarea
          $type="center"
          css={`
            min-width: ${getPolyTileWidth(2)}px;
            min-height: ${TILE_HEIGHT}px;
          `}
          onRealize={(self) => {
            self.set_draw_func(
              (_, cr, width, height) => {
                cr.setSourceRGBA(0.2, 0.2, 0.2, 1) // Dark Gray Background
                cr.paint()

                cr.setSourceRGBA(0.4, 0.6, 1, 1) // Blueish
                // Draw a 2-unit tile starting upright
                drawPolyTile(cr, width, height, 2, true)
                cr.fill()

                // Draw Subtile Boundaries (Thinner, lighter)
                cr.setSourceRGBA(0, 0, 0, 0.5)
                cr.setLineWidth(1)
                drawSubtileBoundaries(cr, height, 2, true)
                cr.stroke()

                // Draw Unit Boundaries (Thicker, darker)
                cr.setSourceRGBA(0, 0, 0, 1)
                cr.setLineWidth(2)
                drawUnitBoundaries(cr, height, 2, true)
                cr.stroke()
              },
              null,
              null
            )
          }}
        />
        <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
          <label label={time} />
          <popover>
            <Gtk.Calendar />
          </popover>
        </menubutton>
      </centerbox>
    </window>
  )
}
