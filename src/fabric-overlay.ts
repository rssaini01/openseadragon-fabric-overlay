import { Canvas, CanvasOptions, Point as FabricPoint } from "fabric";
import OpenSeadragon from "openseadragon";

export interface FabricOverlayConfig {
  fabricCanvasOptions: Partial<CanvasOptions>;
}

class FabricOverlay {
  private readonly _viewer: OpenSeadragon.Viewer;
  private readonly _canvas: HTMLCanvasElement;
  private readonly _fabricCanvas: Canvas;

  private readonly _id: string;
  private _containerWidth: number;
  private _containerHeight: number;
  private readonly _canvasDiv: HTMLDivElement;

  viewer(): OpenSeadragon.Viewer {
    return this._viewer;
  }

  canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  fabricCanvas(): Canvas {
    return this._fabricCanvas;
  }

  clearFabric(): void {
    this._fabricCanvas.clear();
  }

  renderAllFabric(): void {
    this._fabricCanvas.renderAll();
  }

  resizeCanvas(): void {
    if (this._containerWidth !== this._viewer.container.clientWidth) {
      this._containerWidth = this._viewer.container.clientWidth;
      this._canvasDiv.setAttribute("width", String(this._containerWidth));
      this._canvas.setAttribute("width", String(this._containerWidth));
    }

    if (this._containerHeight !== this._viewer.container.clientHeight) {
      this._containerHeight = this._viewer.container.clientHeight;
      this._canvasDiv.setAttribute("height", String(this._containerHeight));
      this._canvas.setAttribute("height", String(this._containerHeight));
    }
  }

  resizeFabric(): void {
    let origin = new OpenSeadragon.Point(0, 0);
    let viewportZoom = this._viewer.viewport.getZoom(true);
    let viewportToImageZoom =
      this._viewer.viewport.viewportToImageZoom(viewportZoom);
    this._fabricCanvas.setWidth(this._containerWidth);
    this._fabricCanvas.setHeight(this._containerHeight);

    /** Original package way of syncing OSD zoom to Fabric zoom */
    this._fabricCanvas.setZoom(viewportZoom);

    /** Alternative way of syncing OSD zoom to Fabric zoom, which keeps horizontal window resizing in sync */
    this._fabricCanvas.setZoom(viewportToImageZoom);

    let viewportWindowPoint =
      this._viewer.viewport.viewportToWindowCoordinates(origin);
    let x = Math.round(viewportWindowPoint.x);
    let y = Math.round(viewportWindowPoint.y);
    let canvasOffset = this._canvasDiv.getBoundingClientRect();

    let pageScroll = OpenSeadragon.getPageScroll();

    this._fabricCanvas.absolutePan(
      new FabricPoint(
        canvasOffset.left - x + pageScroll.x,
        canvasOffset.top - y + pageScroll.y
      )
    );
  }

  clearFabricSelection(): void {
    if (this._fabricCanvas.isDrawingMode) {
      // If in free drawing mode, clear the free drawing selection
      this._fabricCanvas.isDrawingMode = false;
      this._fabricCanvas.clearContext(this._fabricCanvas.getContext());
    } else {
      // If in object selection mode, discard the active object
      this._fabricCanvas.discardActiveObject();
    }
    this._fabricCanvas.requestRenderAll();
  }

  setViewerMouseNavEnabled(state = true): void {
    if (!this._viewer) return;
    this._viewer.setMouseNavEnabled(state);
  }

  updateCanvasRotation(deg: number): void {
    if (deg < 0 || deg > 360) return;
    this._viewer.world.getItemAt(0).setRotation(deg, true);
  }

  constructor(
    viewer: OpenSeadragon.Viewer,
    { fabricCanvasOptions = { selection: false } }: FabricOverlayConfig,
    id: string
  ) {
    let self = this;

    this._viewer = viewer;

    this._containerWidth = 0;
    this._containerHeight = 0;

    this._canvasDiv = document.createElement("div");
    this._canvasDiv.style.position = "absolute";
    this._canvasDiv.style.left = "0px";
    this._canvasDiv.style.top = "0px";
    this._canvasDiv.style.width = "100%";
    this._canvasDiv.style.height = "100%";
    this._viewer.canvas.appendChild(this._canvasDiv);

    this._canvas = document.createElement("canvas");

    this._id = `osd-canvas-${id}`;
    this._canvas.setAttribute("id", this._id);
    this._canvasDiv.appendChild(this._canvas);
    this.resizeCanvas();

    this._fabricCanvas = new Canvas(this._canvas, fabricCanvasOptions);

    /**
     * Prevent OSD mousedown on fabric objects
     */
    this._fabricCanvas.on("mouse:down", function (options: any) {
      if (options.target) {
        options.e.preventDefault();
        options.e.stopPropagation();
      }
    });

    /**
     * Prevent OSD mouseup on fabric objects
     */
    this._fabricCanvas.on("mouse:up", function (options: any) {
      if (options.target) {
        options.e.preventDefault();
        options.e.stopPropagation();
      }
    });

    /**
     * Update viewport
     */
    this._viewer.addHandler("update-viewport", function () {
      self.resizeFabric();
      self.resizeCanvas();
      self.renderAllFabric();
    });

    /**
     * Resize the fabric.js overlay when the viewer or window changes size
     */
    this._viewer.addHandler("open", function () {
      self.resizeFabric();
      self.resizeCanvas();
    });
    window.addEventListener("resize", function () {
      self.resizeFabric();
      self.resizeCanvas();
    });
  }
}

const isRequiredPluginInstalled = (): boolean => {
  if (!OpenSeadragon) {
    console.error("[openseadragon-fabric-overlay] requires OpenSeadragon");
    return false;
  }
  if (!Canvas) {
    console.error("[openseadragon-fabric-overlay] requires FabricJS");
    console.error("Please import FabricJS before importing this package");
    return false;
  }
  return true;
};

export function initOSDFabricOverlay(
  viewer: OpenSeadragon.Viewer,
  options: FabricOverlayConfig,
  id: string
): FabricOverlay {
  if (!isRequiredPluginInstalled()) {
    throw new Error(
      "[openseadragon-fabric-overlay] required plugins are not installed"
    );
  }

  return new FabricOverlay(viewer, options, id);
}

export type { FabricOverlay };
