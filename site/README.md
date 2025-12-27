# Demo Site

This demo site showcases the OpenSeadragon Fabric Overlay plugin using **Preact** for state management and UI components.

## Architecture

The demo is built with a component-based architecture:

- **App.tsx** - Main app component managing global state
- **components/Header.tsx** - Mode toggle (Fabric/Navigation)
- **components/Toolbar.tsx** - Drawing tools and controls
- **components/Viewer.tsx** - OpenSeadragon viewer with Fabric overlay

## State Management

All state is managed using Preact hooks:

- `isFabricMode` - Toggle between Fabric and Navigation modes
- `currentTool` - Active drawing tool (select, draw, rect, circle, text)
- `currentColor` - Color for shapes and drawing
- `brushSize` - Brush size for freehand drawing
- `exactSelection` - Enable/disable exact selection mode
- `selectAllMode` - Toggle select all at point mode

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
