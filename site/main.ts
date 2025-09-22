import OpenSeadragon from "openseadragon";
import {
  FabricOverlay,
  FabricOverlayConfig,
  initOSDFabricOverlay,
} from "openseadragon-fabric-overlay";
import * as fabric from "fabric";

// Init OSD
const viewer = OpenSeadragon({
  id: "openseadragon",
  prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
  tileSources:
    "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
});

const options: FabricOverlayConfig = {
  fabricCanvasOptions: {
    selection: false,
  },
};

// Init Fabric Overlay
const fabricOverlay: FabricOverlay = initOSDFabricOverlay(viewer, options, "1");

// Example: add a rectangle after load
viewer.addHandler("open", () => {
  const rect = new fabric.Rect({
    width: 500,
    height: 300,
    top: 600,
    left: 600,
    fill: "rgba(0, 128, 255, 0.5)",
    stroke: "blue",
    strokeWidth: 4,
  });

  fabricOverlay.fabricCanvas().add(rect);
});
