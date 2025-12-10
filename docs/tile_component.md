# Tile Component Documentation

## Overview

The `Tile` component is a reusable widget that renders geometric trapezoidal tiles using Cairo drawing. It supports dynamic styling, subtile coloring, and interactive content.

## Props

| Prop        | Type                     | Default                 | Description                                  |
| ----------- | ------------------------ | ----------------------- | -------------------------------------------- |
| `units`     | `number`                 | _required_              | Number of base trapezoid units to render     |
| `offset`    | `number`                 | `0`                     | Starting parity (0 = upright, 1 = inverted)  |
| `subtiles`  | `Record<number, string>` | `{}`                    | Map of subtile indices to color strings      |
| `baseColor` | `string`                 | `"rgba(50, 50, 50, 1)"` | Base tile fill color (hex or rgba)           |
| `showGrid`  | `boolean`                | `false`                 | Whether to show internal triangle grid lines |
| `children`  | `any`                    | `undefined`             | Child widgets to render alongside the tile   |
| `className` | `string`                 | `undefined`             | CSS class name                               |
| `css`       | `string`                 | `undefined`             | Inline CSS styles                            |

## Usage

### Basic Example

```tsx
import Tile from "./widget/Tile"

// Simple 2-unit tile with blue background
;<Tile units={2} baseColor="rgba(100, 150, 255, 1)" />
```

### With Subtiles

```tsx
// 3-unit tile with colored triangular subtiles
<Tile
  units={3}
  offset={0}
  baseColor="rgba(50, 50, 50, 1)"
  subtiles={{
    0: "rgba(255, 0, 0, 1)", // First triangle red
    3: "rgba(0, 255, 0, 1)", // Fourth triangle green
    7: "rgba(0, 0, 255, 1)", // Eighth triangle blue
  }}
  showGrid={true}
/>
```

### With Interactive Content

```tsx
// Tile with label and button
<Tile units={2} baseColor="rgba(100, 150, 255, 1)">
  <label label="CPU" />
  <button onClicked={() => print("Clicked!")}>
    <label label="Refresh" />
  </button>
</Tile>
```

## Layout Architecture

### Limitation: No Overlay Support

**Important:** The Tile component does **not** use GTK's `Overlay` widget due to a known issue in AGS where `DrawingArea` widgets fail to realize when placed inside an `Overlay` hierarchy.

### Workaround: Box-Based Composition

Instead, the component uses a **Box container** with children as **siblings** to the DrawingArea:

```
<box>
  <drawingarea />  ← Cairo-drawn tile
  {children}       ← Your labels, buttons, etc. (siblings, not overlaid)
</box>
```

This means:

- ✅ Interactive widgets (buttons, labels) render **next to** the tile
- ❌ Cannot position widgets **on top of** the drawn tile geometry
- ✅ Use CSS `position: absolute` or flexbox for custom positioning if needed

### Comparison with HyprPanel Pattern

HyprPanel (a similar AGS project) uses the same approach:

- All interactive widgets are wrapped in `<box>` or `<eventbox>`
- `DrawingArea` and interactive elements are siblings, not layered
- Visual layering achieved via CSS when needed

## Subtile Indexing

Subtiles are numbered **left-to-right**, with each trapezoid unit containing 3 triangles:

```
Unit 0:  [0] [1] [2]
Unit 1:  [3] [4] [5]
Unit 2:  [6] [7] [8]
...
```

For a 2-unit tile (`units={2}`):

- Valid indices: 0-5
- Index 0: First upright triangle (left edge)
- Index 5: Last inverted triangle (right edge)

## Color Formats

Both hex strings and RGBA strings are supported:

```tsx
baseColor="#3498db"              // Hex
baseColor="rgba(52, 152, 219, 1)"  // RGBA

subtiles={{
  0: "#e74c3c",                  // Hex
  1: "rgba(231, 76, 60, 0.5)"    // RGBA with transparency
}}
```

## Examples

### Status Module with Interactive Refresh

```tsx
<Tile units={2} baseColor="rgba(100, 150, 255, 1)" className="cpu-tile">
  <box orientation={Gtk.Orientation.VERTICAL}>
    <label label="CPU: 45%" />
    <button onClicked={() => print("Refreshing CPU stats...")}>
      <label label="↻" />
    </button>
  </box>
</Tile>
```

**Note:** In GTK4, use `orientation={Gtk.Orientation.VERTICAL}` instead of the `vertical` shorthand property.

### Multi-State Indicator

```tsx
const cpuLoad = 0.75 // 75% load

<Tile
  units={3}
  baseColor="rgba(50, 50, 50, 1)"
  subtiles={{
    0: cpuLoad > 0.33 ? "rgba(255, 165, 0, 1)" : undefined,
    3: cpuLoad > 0.66 ? "rgba(255, 100, 0, 1)" : undefined,
    6: cpuLoad > 0.90 ? "rgba(255, 0, 0, 1)" : undefined,
  }}
  showGrid={true}
>
  <label label={`${Math.round(cpuLoad * 100)}%`} />
</Tile>
```

### Clock Module

```tsx
import { Variable, GLib } from "astal"

const time = Variable("").poll(1000, () =>
  GLib.DateTime.new_now_local().format("%H:%M") || ""
)

<Tile units={2} baseColor="rgba(70, 130, 180, 1)">
  <label label={time()} widthRequest={200} halign={Gtk.Align.CENTER} />
</Tile>
```

## Implementation Notes

### Drawing Pipeline

The component's draw function executes in this order:

1. **Base Shape**: Fills the trapezoidal outline with `baseColor`
2. **Subtiles**: Draws individual triangles from the `subtiles` map
3. **Grid** (optional): Strokes internal triangle boundaries if `showGrid={true}`

### Sizing

- Width: Automatically calculated via `getPolyTileWidth(units)`
- Formula: `SIDE_LENGTH * (1 + 3 * units) / 2`
- Height: Fixed at `TILE_HEIGHT` (from `lib/drawing.ts`)
- Alignment: `CENTER` (prevents expansion to fill container)

### Performance

- DrawingArea uses `set_draw_func()` callback (GTK4 API)
- Redraws only when necessary (parent container resizes)
- Use fixed `widthRequest` on child labels to prevent constant redraws

## Troubleshooting

### Children Not Appearing

If child widgets don't render:

1. Check console for AGS errors
2. Ensure children are valid GTK widgets
3. Verify the Box container has proper sizing (`hexpand`, `vexpand` as needed)

### DrawingArea Not Visible

If the tile doesn't appear:

1. Verify `widthRequest` and `heightRequest` are set correctly
2. Check that `halign` and `valign` are `CENTER` (not `FILL`)
3. Look for console logs: `[Tile] DrawingArea realized` should appear

### Constant Redraws

If the bar flickers or redraws constantly:

1. Set fixed `widthRequest` on time/clock labels
2. Use `halign={Gtk.Align.CENTER}` on labels
3. Avoid using `hexpand` on variable-width content

## Related Files

- `lib/drawing.ts`: Core Cairo drawing functions
- `widget/Bar.tsx`: Example usage in the main bar
- `docs/COPILOT_INSTRUCTIONS.md`: Architecture guidelines
