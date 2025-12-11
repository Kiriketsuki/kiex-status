import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import Tile from "./Tile"
import TileGroup from "./TileGroup"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  print("Rendering Bar component")
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
        <box $type="center" hexpand halign={Gtk.Align.CENTER} spacing={10}>
          {/* Example 0: Single 1-unit tile */}
          <Tile
            units={1}
            offset={0}
            baseColor="rgba(255, 100, 150, 1)"
            showGrid={false}
          >
            <label
              label="Hi"
              css="color: white; font-weight: bold; font-size: 12px;"
            />
          </Tile>

          {/* Example 1: Single tile with CPU label */}
          <Tile
            units={2}
            offset={0}
            baseColor="rgba(100, 150, 255, 1)"
            subtiles={{ 1: "rgba(255, 0, 0, 1)" }}
            showGrid={true}
          >
            <label label="CPU" css="color: white; font-weight: bold;" />
          </Tile>

          {/* Example 2: TileGroup with overlay spanning multiple tiles */}
          <TileGroup
            tiles={[
              <Tile
                units={2}
                offset={1}
                baseColor="rgba(70, 130, 180, 1)"
                subtiles={{
                  0: "rgba(0, 255, 100, 1)",
                  5: "rgba(255, 165, 0, 1)",
                }}
                showGrid={false}
              />,
              <Tile
                units={2}
                offset={0}
                baseColor="rgba(100, 150, 200, 1)"
                subtiles={{ 2: "rgba(255, 200, 0, 1)" }}
                showGrid={false}
              />,
            ]}
            spacing={0}
            overlay={
              <button
                css="background: rgba(0,0,0,0.5); border-radius: 5px; padding: 5px 15px;"
                onClicked={() => {
                  print("🔘 Spanning button clicked!")
                  execAsync(
                    "notify-send 'TileGroup' 'This button spans both tiles!'"
                  ).catch(console.error)
                }}
              >
                <label
                  label="Click Me"
                  css="color: white; font-weight: bold;"
                />
              </button>
            }
          />

          {/* Example 3: Single tile with its own overlay */}
          <Tile
            units={3}
            offset={0}
            baseColor="rgba(50, 50, 50, 1)"
            subtiles={{
              0: "rgba(255, 0, 0, 1)",
              3: "rgba(0, 255, 0, 1)",
              6: "rgba(0, 0, 255, 1)",
            }}
            showGrid={true}
          >
            <box
              orientation={Gtk.Orientation.VERTICAL}
              spacing={5}
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
              css="background: rgba(0,0,0,0.5); border-radius: 5px; padding: 10px;"
            >
              <label
                label="Memory: 4.2GB"
                css="color: white; font-weight: bold;"
              />
              <box spacing={5}>
                <button
                  css="background: rgba(255,255,255,0.2); border-radius: 3px; min-width: 30px;"
                  onClicked={() => print("⬆️ Up arrow clicked")}
                >
                  <label label="↑" css="color: white;" />
                </button>
                <button
                  css="background: rgba(255,255,255,0.2); border-radius: 3px; min-width: 30px;"
                  onClicked={() => print("⬇️ Down arrow clicked")}
                >
                  <label label="↓" css="color: white;" />
                </button>
              </box>
            </box>
          </Tile>
        </box>
        <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
          <label label={time()} widthRequest={200} halign={Gtk.Align.CENTER} />
          <popover>
            <Gtk.Calendar />
          </popover>
        </menubutton>
      </centerbox>
    </window>
  )
}
