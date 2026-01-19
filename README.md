# OpenSeadragon Fabric Overlay

[![codecov](https://codecov.io/github/rssaini01/openseadragon-fabric-overlay/graph/badge.svg?token=DVRLSUSBQQ)](https://codecov.io/github/rssaini01/openseadragon-fabric-overlay)
[![npm version](https://img.shields.io/npm/v/openseadragon-fabric-overlay.svg)](https://www.npmjs.com/package/openseadragon-fabric-overlay)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/rssaini01/openseadragon-fabric-overlay/deploy-demo-site.yml?branch=main)](https://github.com/rssaini01/openseadragon-fabric-overlay/actions)
[![Downloads](https://img.shields.io/npm/dm/openseadragon-fabric-overlay.svg)](https://www.npmjs.com/package/openseadragon-fabric-overlay)

A powerful plugin that seamlessly integrates [FabricJS](http://fabricjs.com/) with [OpenSeadragon](https://openseadragon.github.io/), enabling interactive annotations, drawings, and shape manipulation on top of deep-zoom images.

> **⚠️ Version 2.0 Breaking Changes**: This version uses Fabric.js 7.x..

**[Live Demo](https://rssaini01.github.io/openseadragon-fabric-overlay/)** | **[Report Bug](https://github.com/rssaini01/openseadragon-fabric-overlay/issues)** | **[Request Feature](https://github.com/rssaini01/openseadragon-fabric-overlay/issues)**

## Features

- ✨ **Interactive Annotations** - Add shapes, text, and drawings that scale with image zoom
- 🎨 **Full FabricJS Support** - Access all FabricJS features and objects
- 🖱️ **Freehand Drawing** - Built-in support for pencil, spray, and custom brushes
- 📐 **Shape Tools** - Rectangles, circles, polygons, lines, and more
- 🔄 **Automatic Synchronization** - Overlay stays perfectly aligned during pan and zoom
- 📦 **TypeScript Support** - Full type definitions included
- 🪶 **Lightweight** - Minimal overhead, maximum performance
- 🔧 **Highly Configurable** - Customize every aspect of the overlay

## Installation

```bash
npm install openseadragon-fabric-overlay
```

### Peer Dependencies

Ensure you have the required peer dependencies installed:

```bash
npm install openseadragon fabric@^7.1.0
```

> **Note**: Version 2.x requires Fabric.js 7.x. For Fabric.js 6.x support, use version 1.x.

## Quick Start

```typescript
import OpenSeadragon from "openseadragon";
import { Rect } from "fabric";
import { initOSDFabricOverlay } from "openseadragon-fabric-overlay";

// Initialize OpenSeadragon viewer
const viewer = OpenSeadragon({
  id: "viewer",
  prefixUrl: "//openseadragon.github.io/openseadragon/images/",
  tileSources: "//openseadragon.github.io/example-images/highsmith/highsmith.dzi",
});

// Create fabric overlay
const overlay = initOSDFabricOverlay(viewer, {
  fabricCanvasOptions: {
    selection: true,
  },
});

// Add a rectangle
const rect = new Rect({
  left: 100,
  top: 100,
  width: 200,
  height: 150,
  fill: "rgba(255, 0, 0, 0.3)",
  stroke: "#ff0000",
  strokeWidth: 2,
});

overlay.fabricCanvas().add(rect);
```

## API Reference

### initOSDFabricOverlay

Initialize the fabric overlay on an OpenSeadragon viewer.

```typescript
function initOSDFabricOverlay(
  viewer: OpenSeadragon.Viewer,
  options?: FabricOverlayOptions,
  overlayId?: string
): FabricOverlay
```

**Parameters:**

- `viewer` - OpenSeadragon viewer instance
- `options` - Configuration options (optional)
  - `fabricCanvasOptions` - Options passed to FabricJS canvas constructor
- `overlayId` - Unique identifier for the overlay (optional)

**Returns:** FabricOverlay instance

### FabricOverlay Methods

#### fabricCanvas()

Get the underlying FabricJS canvas instance.

```typescript
overlay.fabricCanvas(): fabric.Canvas
```

#### resize()

Manually trigger a resize of the overlay canvas.

```typescript
overlay.resize(): void
```

#### clear()

Remove all objects from the canvas.

```typescript
overlay.fabricCanvas().clear();
```

## Usage Examples

### Adding Shapes

#### Rectangle

```typescript
const rect = new Rect({
  left: 200,
  top: 200,
  width: 300,
  height: 200,
  fill: "rgba(0, 123, 255, 0.2)",
  stroke: "#007bff",
  strokeWidth: 3,
});

overlay.fabricCanvas().add(rect);
```

#### Circle

```typescript
const circle = new Circle({
  left: 500,
  top: 300,
  radius: 100,
  fill: "rgba(40, 167, 69, 0.2)",
  stroke: "#28a745",
  strokeWidth: 3,
});

overlay.fabricCanvas().add(circle);
```

#### Text

```typescript
const text = new Text("Hello World", {
  left: 300,
  top: 400,
  fontSize: 40,
  fill: "#333",
  fontFamily: "Arial",
});

overlay.fabricCanvas().add(text);
```

#### Polygon

```typescript
const polygon = new Polygon(
  [
    { x: 100, y: 100 },
    { x: 200, y: 50 },
    { x: 300, y: 100 },
    { x: 250, y: 200 },
    { x: 150, y: 200 },
  ],
  {
    fill: "rgba(255, 193, 7, 0.2)",
    stroke: "#ffc107",
    strokeWidth: 2,
  }
);

overlay.fabricCanvas().add(polygon);
```

### Freehand Drawing

Enable drawing mode with a pencil brush:

```typescript
// Disable OpenSeadragon mouse navigation
viewer.setMouseNavEnabled(false);

const canvas = overlay.fabricCanvas();

// Configure pencil brush
canvas.freeDrawingBrush = new PencilBrush(canvas);
canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = "#000000";
canvas.isDrawingMode = true;

// To disable drawing mode
canvas.isDrawingMode = false;
viewer.setMouseNavEnabled(true);
```

### Spray Brush

```typescript
canvas.freeDrawingBrush = new SprayBrush(canvas);
canvas.freeDrawingBrush.width = 10;
canvas.freeDrawingBrush.color = "#ff0000";
canvas.isDrawingMode = true;
```

### Object Selection and Manipulation

```typescript
// Enable selection
overlay.fabricCanvas().selection = true;

// Listen to selection events
overlay.fabricCanvas().on("selection:created", (e) => {
  console.log("Object selected:", e.selected);
});

overlay.fabricCanvas().on("object:modified", (e) => {
  console.log("Object modified:", e.target);
});

// Get active object
const activeObject = overlay.fabricCanvas().getActiveObject();

// Remove active object
if (activeObject) {
  overlay.fabricCanvas().remove(activeObject);
}
```

### Serialization and Deserialization

Save and restore canvas state:

```typescript
// Save canvas to JSON
const json = overlay.fabricCanvas().toJSON();
localStorage.setItem("canvas", JSON.stringify(json));

// Load canvas from JSON
const savedJson = JSON.parse(localStorage.getItem("canvas"));
overlay.fabricCanvas().loadFromJSON(savedJson, () => {
  overlay.fabricCanvas().renderAll();
});
```

### Custom Object Properties

```typescript
const rect = new Rect({
  left: 100,
  top: 100,
  width: 200,
  height: 100,
  fill: "blue",
  // Custom properties
  id: "my-rect-1",
  metadata: {
    type: "annotation",
    author: "John Doe",
    timestamp: Date.now(),
  },
});

overlay.fabricCanvas().add(rect);

// Access custom properties
rect.on("selected", () => {
  console.log(rect.id, rect.metadata);
});
```

### Event Handling

```typescript
const canvas = overlay.fabricCanvas();

// Mouse events
canvas.on("mouse:down", (e) => console.log("Mouse down", e.pointer));
canvas.on("mouse:move", (e) => console.log("Mouse move", e.pointer));
canvas.on("mouse:up", (e) => console.log("Mouse up", e.pointer));

// Object events
canvas.on("object:added", (e) => console.log("Object added", e.target));
canvas.on("object:removed", (e) => console.log("Object removed", e.target));
canvas.on("object:modified", (e) => console.log("Object modified", e.target));

// Selection events
canvas.on("selection:created", (e) => console.log("Selection created"));
canvas.on("selection:cleared", (e) => console.log("Selection cleared"));
```

## Advanced Configuration

### Custom Canvas Options

```typescript
const overlay = initOSDFabricOverlay(viewer, {
  fabricCanvasOptions: {
    selection: true,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    renderOnAddRemove: true,
    enableRetinaScaling: true,
    allowTouchScrolling: false,
    preserveObjectStacking: true,
  },
  scale: 1000,
});
```

### Coordinate Conversion

Convert between viewport and canvas coordinates:

```typescript
// OpenSeadragon viewport point to canvas point
const viewportPoint = viewer.viewport.pointFromPixel(
  new OpenSeadragon.Point(100, 100)
);
const canvasPoint = {
  x: viewportPoint.x * overlay.fabricCanvas().getWidth(),
  y: viewportPoint.y * overlay.fabricCanvas().getHeight(),
};
```

## Best Practices

1. **Disable Mouse Navigation During Drawing**
   ```typescript
   viewer.setMouseNavEnabled(false); // When drawing
   viewer.setMouseNavEnabled(true); // When done
   ```

2. **Optimize Performance**
   ```typescript
   // Disable rendering during bulk operations
   overlay.fabricCanvas().renderOnAddRemove = false;
   // Add multiple objects
   overlay.fabricCanvas().add(obj1, obj2, obj3);
   // Re-enable and render
   overlay.fabricCanvas().renderOnAddRemove = true;
   overlay.fabricCanvas().renderAll();
   ```

3. **Clean Up Event Listeners**
   ```typescript
   // Remove specific listener
   canvas.off("mouse:down", handler);
   
   // Remove all listeners for an event
   canvas.off("mouse:down");
   ```

## Limitations

- Static FabricJS canvases are not supported
- For non-interactive overlays, disable interactions via `fabricCanvasOptions`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Update version in `package.json`
5. Build the project (`npm run build`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run demo site locally
npm run dev

# Run tests
npm test
```

### Testing Locally

```bash
# Build the package
npm run build

# Link locally
npm link

# In your test project
npm link openseadragon-fabric-overlay
```

## Publishing

```bash
# Update version in package.json
npm version patch|minor|major

# Build and publish
npm run build
npm publish
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project builds upon the excellent work of:

- [@brunoocastro](https://github.com/brunoocastro) - [openseadragon-fabric](https://github.com/brunoocastro/openseadragon-fabric)
- [OpenSeadragon](https://openseadragon.github.io/) - Deep zoom image viewer
- [FabricJS](http://fabricjs.com/) - Canvas library

## Support

- 📖 [Documentation](https://github.com/rssaini01/openseadragon-fabric-overlay)
- 🐛 [Issue Tracker](https://github.com/rssaini01/openseadragon-fabric-overlay/issues)
- 💬 [Discussions](https://github.com/rssaini01/openseadragon-fabric-overlay/discussions)

---

Made with ❤️ by [Ravi Shankar Saini](https://github.com/rssaini01)
