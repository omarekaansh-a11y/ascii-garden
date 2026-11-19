# ascii garden

Animals drawn as ASCII on a canvas, crossing the screen along one course. Zero dependencies.

Pick one from the row of animals in the top bar. Dark mode only, and each animal has its own colour:

| Animal | How it moves |
|---|---|
| Butterfly | blue morphos on migration: flutter, zigzag, glide with wings flat |
| Koi | lazy S-curves on bendy spines; kohaku, sanke, showa, ogon and chagoi; tap to drop food and koi close by swim over to eat |
| Jellyfish | bioluminescent magenta: each pulse lights the bell up, then the glow eases out; frilly twisting arms, marine snow (made for dark mode) |
| Dragonfly | emerald hawkers: hover, dart, cruise along for a while; white eyes with black pupils on the nearer ones, a striped green thorax, a dark body banded emerald, clear veined wings with a sweeping glint (made for dark mode) |
| Frog | spotted leopard frogs that sit, breathe and blink, then leap in an arc (bigger at the top), with a splash on landing |
| Crane | red-crowned, after the paintings: each flies its own way along the course, flapping at its own pace and gliding now and then (Folding flap in Tweaks for a slow downstroke and a quick, wrist-folding upstroke); broad white wings with splayed fingers and black secondaries, a red crown, dark eyes on the nearer ones |
| Crab | scuttle sideways in bursts, legs stepping, footprints in the sand; tap and they bolt away, claws up |
| Sea Turtle | green sea turtles: rhythmic paddle strokes on broad front flippers and long graceful glides; rich amber-gold and olive mosaic shell (carapace) with distinct scute tiles and radiating patterns; tap and they bank into a startled turn |

Everywhere:

- smaller ones are farther away: they move slower and fade into the background
- whoever leaves downstream comes back in upstream
- **click** to startle the ones nearby (each animal reacts its own way)
- the last animal picked is remembered between visits
- a **vertical scroll odometer clock** resting above the greeting:
  crisp, luminous tabular numbers that roll smoothly down from the top like a physical odometer wheel as minutes change; click the clock anytime (or toggle in Tweaks) to switch between 12-hour (with AM/PM) and 24-hour mode
- a greeting by the time of day ("Good morning, ekaansh!" or "Still up, ekaansh?" after 10pm) resting below the clock; double-click the name anytime to change it
- a liquid-glass search composer in the middle:
  search query input using your browser's default search engine or direct URL navigation, "Add tabs or files", voice input, and search execution; the refraction uses an SVG filter in Chromium and falls back to frosted glass elsewhere
- a frosted-glass **bookmarks bar** at the top:
  shows your browser's bookmarks and nested folders with dynamic favicons and an overflow menu
- a **Tweaks** panel (top right):
  **General** settings at the very top with a Max FPS limit slider (30 to 144 FPS) and 12h / 24h Clock format choices, followed by shared Movement and Look sliders plus each animal's own, saved per animal; values slide with tabular numbers; double-click a label to reset it, **Copy** exports what you changed as JSON
- **zero battery drain**: rendering automatically suspends when switching to another tab, dropping CPU & GPU usage to 0%

## Install as a Chrome Extension

1. Download **`ascii-garden-extension.zip`** from [Releases](https://github.com/omarekaansh-a11y/ascii-garden/releases) and unzip it (or clone this repo).
2. Open `chrome://extensions` in Chrome (or `edge://extensions`, `brave://extensions`).
3. Turn on **Developer mode** in the top right.
4. Click **Load unpacked** and select this folder.
5. Open a new tab (`Ctrl + T`)!

## Keyboard

| Key | Action |
| --- | --- |
| `1` to `8` | Switch animal (Butterfly, Koi, Jellyfish, Dragonfly, Frog, Crane, Crab, Sea Turtle) |
| `Esc` | Close Tweaks panel or Bookmarks menu |

Built on the engine and renderer from [ascii-animals](https://github.com/DesignerStephen1/ascii-animals) by Stephen and [ascii-sharks](https://github.com/stackedlol/ascii-sharks).
