kiex-status: Project Setup & Tiling Architecture

This guide details how to initialize kiex-status as a standalone Git project (intended to be used as a submodule) and how to implement a modular, geometric status bar using AGS.

1. Project Initialization

We will create a clean directory structure, initialize git, and set up the basic AGS boilerplate.

A. Git Setup

# 1. Create the project directory

mkdir kiex-status
cd kiex-status

# 2. Initialize Git

git init
git checkout -b main

# 3. Create a .gitignore

echo "node_modules/\n.cache/\nresult/" > .gitignore

# 4. (Optional) If adding this as a submodule to a dotfiles repo later:

# git submodule add ./path/to/kiex-status

B. Installing AGS (Dependencies)

AGS (Aylur's GTK Shell) is the runtime. This project also uses `gnim` (for JSX widgets) and `astal` libraries.

**Arch Linux:**

```bash
yay -S aylurs-gtk-shell-git # Installs AGS and Astal dependencies
npm install # Installs gnim and other project dependencies
```

**Nix:**

```bash
nix shell github:aylur/ags
npm install
```

**From Source:**

1.  Install **Astal** libraries (`astal-io`, `astal3`, `astal4`).
2.  Install **AGS** CLI from source (requires `meson`, `ninja`, `gtk4`, etc.).
3.  Run `npm install` in this project to install **Gnim** and TypeScript definitions.

See the [official installation guide](https://aylur.github.io/ags/guide/install.html) for detailed steps.

C. TypeScript Definitions

Initialize a package.json to get IntelliSense in your editor.

npm init -y
npm install # Installs dependencies listed in package.json

Create a tsconfig.json (optional but recommended for VSCode):

{
"compilerOptions": {
"target": "es2022",
"module": "commonjs",
"allowJs": true,
"checkJs": true,
"noEmit": true,
"moduleResolution": "node"
},
"include": ["config.js", "**/*.js"]
}

2. The Architecture: "Base Tile" System

To achieve the "interlocking" effect, we treat the bar as a collection of independent modules composed of trapezoids.

Unit: The width of a single trapezoid.

Parity & Offset: Parity is local to the module. An `offset` parameter determines the starting shape (0 for Upright, 1 for Inverted).

Module Size: A module (like Clock) can consume N units.

Directory Structure

kiex-status/
├── config.js # Entry point
├── style.scss # Styles
├── lib/
│ ├── drawing.js # Cairo drawing logic
│ └── tile.js # The Base Tile component
└── modules/
├── clock.js
└── workspaces.js

3. Implementation

A. The Drawing Logic (lib/drawing.js)

This file handles the Cairo paths. It calculates the shape based on how many "units" a module consumes and its starting position.

// lib/drawing.js

// Configuration
export const TILE_HEIGHT = 40;
export const TILE_WIDTH = 60; // Width of the flat top/bottom part
export const SLANT = 20; // Horizontal space for the angle

/\*\*

- Draws a shape composed of N interlocking tiles.
- @param {Cairo.Context} cr - The drawing context
- @param {number} width - Total widget width
- @param {number} height - Total widget height
- @param {number} units - How many tiles this shape consumes
- @param {boolean} startUpright - True if the first tile is Upright ( / \ ), False if Inverted ( \ / )
  \*/
  export function drawPolyTile(cr, width, height, units, startUpright) {
  const totalWidth = width;

      // Starting coordinates
      // If Upright: Top starts at SLANT, Bottom starts at 0
      // If Inverted: Top starts at 0, Bottom starts at SLANT

      let xTop = startUpright ? SLANT : 0;
      let xBottom = startUpright ? 0 : SLANT;

      cr.moveTo(xBottom, height); // Start bottom-left
      cr.lineTo(xTop, 0);         // Line to top-left

      // Draw Top Edge
      // The top edge length depends on the sequence of tiles.
      // However, for a solid block, we just need the final X coordinate.
      // Visually, the width of N tiles is (N * TILE_WIDTH) + SLANT
      // But simply, we just draw to the calculated width minus the final slant logic.

      const finalIsUpright = (units % 2 === 0) ? !startUpright : startUpright;

      // If the last tile is Upright, the top-right corner is "inwards" by SLANT relative to bottom-right
      // If the last tile is Inverted, the top-right corner is the extreme edge.

      // Actually, simpler logic:
      // We just trace the outline.

      cr.lineTo(width - (finalIsUpright ? SLANT : 0), 0);         // Top Right
      cr.lineTo(width - (finalIsUpright ? 0 : SLANT), height);    // Bottom Right
      cr.lineTo(xBottom, height);                                 // Close loop

      cr.closePath();

  }

B. The Base Tile Component (lib/tile.js)

This component wraps the AGS DrawingArea and handles sizing.

import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import { drawPolyTile, TILE_HEIGHT, TILE_WIDTH, SLANT } from './drawing.js';

/\*\*

- @param {Object} props
- @param {number} props.units - Number of tiles to consume (default 1)
- @param {number} props.index - Global index to determine parity (Upright/Inverted)
- @param {import('types/widgets/box').default} props.child - The content to put inside
  \*/
  export const Tile = ({ units = 1, index = 0, child, className = '', ...props }) => {

      // Calculate required pixel width
      // Formula: (Unit Width * N) + Slant
      // Note: The visual "overlap" means we sum the core widths.
      const calculatedWidth = (TILE_WIDTH * units) + (2 * SLANT);
      // *Adjustment might be needed depending on precise geometry desired*

      // Determine orientation based on global index
      const startUpright = index % 2 === 0;

      return Widget.Overlay({
          pass_through: true,
          overlays: [
              Widget.DrawingArea({
                  class_name: `geo-tile units-${units} ${className}`,
                  widthRequest: calculatedWidth,
                  heightRequest: TILE_HEIGHT,
                  setup: self => self.connect('draw', (_, cr) => {
                      const ctx = self.get_style_context();
                      const bg = ctx.get_property('background-color', Gtk.StateFlags.NORMAL);
                      const fg = ctx.get_property('color', Gtk.StateFlags.NORMAL);

                      drawPolyTile(cr, calculatedWidth, TILE_HEIGHT, units, startUpright);

                      Gdk.cairo_set_source_rgba(cr, bg);
                      cr.fillPreserve();

                      Gdk.cairo_set_source_rgba(cr, fg);
                      cr.setLineWidth(2);
                      cr.stroke();
                  })
              })
          ],
          child: Widget.Box({
              hpack: 'center',
              vpack: 'center',
              widthRequest: calculatedWidth, // Force box to take full width for centering
              children: [child]
          })
      });

  };

C. The Status Bar (config.js)

Here we stitch the modules together, managing the index manually to ensure the pattern flows correctly.

import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { Tile } from './lib/tile.js';

// Modules
const Clock = (startIndex) => Tile({
index: startIndex,
units: 2, // Consumes 2 slots
className: 'module-clock',
child: Widget.Label({
label: new Date().toLocaleTimeString(),
class_name: 'text-clock'
})
});

const Workspace = (id, startIndex) => Tile({
index: startIndex,
units: 1,
className: 'module-workspace',
child: Widget.Label({ label: `${id}` })
});

// Layout Builder
// We must track the current index to keep the zipper pattern valid
const BarContent = () => {
let currentIndex = 0;
const widgets = [];

    // 1. Clock (Consumes 2 units)
    widgets.push(Clock(currentIndex));
    currentIndex += 2;

    // 2. Workspaces (3 Workspaces, 1 unit each)
    [1, 2, 3].forEach(id => {
        widgets.push(Workspace(id, currentIndex));
        currentIndex += 1;
    });

    return Widget.Box({
        // Negative spacing to pull them together so borders overlap/interlock
        spacing: -20,
        children: widgets,
    });

};

const Bar = Widget.Window({
name: 'kiex-bar',
anchor: ['top', 'left', 'right'],
child: Widget.CenterBox({
center_widget: BarContent(),
})
});

App.config({
style: './style.scss',
windows: [Bar],
});

4. Styling (style.scss)

window#kiex-bar {
background-color: transparent;
}

.geo-tile {
// Default Colors
background-color: #1e1e2e;
color: #313244; // Border color
}

.module-clock .geo-tile {
background-color: #313244;
color: #45475a;
}

.module-workspace {
// Styling handled by specific logic or classes
}

.text-clock {
color: #cba6f7;
font-weight: bold;
}

5. Summary of Tiling Logic

Tiles are stateful: They need to know their index in the row to know if they should tilt Left-to-Right or Right-to-Left.

Units: A "Unit" is an abstraction.

Index 0 (Even) = Upright Trapezoid / \

Index 1 (Odd) = Inverted Trapezoid \ /

Clock at Index 0 (Size 2) = Union of Index 0 + Index 1 = Parallelogram / /

Spacing: We use negative spacing (equal to the slant width) in the parent Box to make the shapes visual "connect" without gaps.
