# FabricJS Overlay for OpenSeadragon

A lightweight plugin for **[OpenSeadragon](https://openseadragon.github.io/)** that integrates **[FabricJS](http://fabricjs.com/)** as an interactive overlay.
This allows you to draw and manage shapes (rectangles, circles, text, freehand drawings, and more) directly on top of zoomable, high-resolution images.

> 💡 Contributions are always welcome!

---

## 📦 Installation

```bash
npm install openseadragon-fabric-overlay
```

---

## 🚀 Getting Started

Import the plugin **after** importing OpenSeadragon:

```ts
import OpenSeadragon from 'openseadragon';
import { createOSDFabricOverlay } from 'openseadragon-fabric-overlay';
```

Initialize the overlay when creating your viewer:

```ts
const viewer = OpenSeadragon(config);

const fabricOverlay = createOSDFabricOverlay(viewer, {
  fabricCanvasOptions: { selection: false },
}, 1);
```

---

## ✏️ Usage Examples

### Add Shapes

You can directly access the underlying FabricJS canvas through the overlay instance:

```ts
const newRect = new fabric.Rect({
  width: 200,
  height: 100,
  top: 1400,
  left: 1200,
  fill: 'rgba(0,0,0,0.1)',
  stroke: '#000000',
  strokeWidth: 5,
});

fabricOverlay.fabricCanvas().add(newRect);
```

---

### Enable Freehand Drawing

Freehand drawing is supported via FabricJS brushes:

```ts
// Disable default mouse navigation in OpenSeadragon
viewer.setMouseNavEnabled(false);

fabricOverlay.fabricCanvas().freeDrawingBrush = new fabric.PencilBrush(fabricOverlay.fabricCanvas());
fabricOverlay.fabricCanvas().freeDrawingBrush.width = 15;
fabricOverlay.fabricCanvas().freeDrawingBrush.color = selectedColor;
fabricOverlay.fabricCanvas().isDrawingMode = true;
```

---

### Static Canvas Mode

Static FabricJS canvases are **not** supported by this library.
If you need a non-interactive canvas, simply disable interactions during initialization.

---

## 🛠️ Contributing

1. Make your changes.
2. Update the package version in `package.json`.
3. Rebuild the project:

   ```bash
   npm run build
   ```

---

## 🔍 Testing Locally

1. After building, copy the entire repository into your project’s `node_modules/openseadragon-fabric-overlay` folder.
2. Verify everything works as expected.
3. Once tested, publish the package to [NPM](https://www.npmjs.com/package/openseadragon-fabric-overlay):

   ```bash
   npm publish
   ```

---

## 🙏 Acknowledgments

This project is based on prior work from:

* [openseadragon-fabric](https://github.com/brunoocastro/openseadragon-fabric) — Thanks [@brunoocastro](https://github.com/brunoocastro)
