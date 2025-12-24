import OpenSeadragon from "openseadragon";
import {
  FabricOverlay,
  FabricOverlayConfig,
  initOSDFabricOverlay,
} from "openseadragon-fabric-overlay";
import * as fabric from "fabric";

class DemoApp {
  private viewer!: OpenSeadragon.Viewer;
  private fabricOverlay!: FabricOverlay;
  private currentTool = 'select';
  private currentColor = '#ff0000';
  private brushSize = 5;
  private isFabricMode = true;
  private isDrawing = false;
  private startPoint: { x: number; y: number } | null = null;
  private activeShape: fabric.Object | null = null;

  constructor() {
    this.initViewer();
    this.initFabricOverlay();
    this.initEventListeners();
    this.setFabricMode(true); // Initialize fabric mode properly
  }

  private initViewer() {
    this.viewer = OpenSeadragon({
      id: "openseadragon",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
      showNavigationControl: false,
    });
  }

  private initFabricOverlay() {
    const options: FabricOverlayConfig = {
      fabricCanvasOptions: { selection: true },
    };
    this.fabricOverlay = initOSDFabricOverlay(this.viewer, options, "1");
  }

  private initEventListeners() {
    // Mode toggle
    document.getElementById('fabricMode')?.addEventListener('click', () => this.setFabricMode(true));
    document.getElementById('osdMode')?.addEventListener('click', () => this.setFabricMode(false));

    // Tools
    document.getElementById('selectTool')?.addEventListener('click', () => this.setTool('select'));
    document.getElementById('drawTool')?.addEventListener('click', () => this.setTool('draw'));
    document.getElementById('rectTool')?.addEventListener('click', () => this.setTool('rect'));
    document.getElementById('circleTool')?.addEventListener('click', () => this.setTool('circle'));
    document.getElementById('textTool')?.addEventListener('click', () => this.setTool('text'));
    document.getElementById('clearAll')?.addEventListener('click', () => this.clearAll());

    // Controls
    document.getElementById('colorPicker')?.addEventListener('change', (e) => {
      this.currentColor = (e.target as HTMLInputElement).value;
      this.updateBrushColor();
    });
    
    document.getElementById('brushSize')?.addEventListener('input', (e) => {
      this.brushSize = Number.parseInt((e.target as HTMLInputElement).value);
      this.updateBrushSize();
    });

    // Canvas events for drag-to-draw
    this.fabricOverlay.fabricCanvas().on('mouse:down', (e) => this.onMouseDown(e));
    this.fabricOverlay.fabricCanvas().on('mouse:move', (e) => this.onMouseMove(e));
    this.fabricOverlay.fabricCanvas().on('mouse:up', (e) => this.onMouseUp(e));
  }

  private setFabricMode(enabled: boolean) {
    this.isFabricMode = enabled;
    const toolbar = document.getElementById('toolbar');
    const fabricBtn = document.getElementById('fabricMode');
    const osdBtn = document.getElementById('osdMode');

    if (enabled) {
      toolbar?.classList.remove('hidden');
      fabricBtn?.classList.add('active');
      osdBtn?.classList.remove('active');
      this.fabricOverlay.setViewerMouseNavEnabled(false);
    } else {
      toolbar?.classList.add('hidden');
      fabricBtn?.classList.remove('active');
      osdBtn?.classList.add('active');
      this.fabricOverlay.setViewerMouseNavEnabled(true);
      this.fabricOverlay.fabricCanvas().isDrawingMode = false;
    }
  }

  private setTool(tool: string) {
    this.currentTool = tool;
    
    // Update UI
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tool + 'Tool')?.classList.add('active');

    const canvas = this.fabricOverlay.fabricCanvas();
    
    if (tool === 'draw') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      this.updateBrushColor();
      this.updateBrushSize();
    } else {
      canvas.isDrawingMode = false;
    }
  }

  private updateBrushColor() {
    const canvas = this.fabricOverlay.fabricCanvas();
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = this.currentColor;
    }
  }

  private updateBrushSize() {
    const canvas = this.fabricOverlay.fabricCanvas();
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = this.brushSize;
    }
  }

  private onMouseDown(e: fabric.TPointerEventInfo) {
    if (!this.isFabricMode || this.currentTool === 'draw') return;
    
    // If there's a target (existing object), let Fabric handle it for selection/moving
    if (e.target) return;
    
    // Only create new shapes if no object is selected and not in select mode
    if (this.currentTool === 'select') return;
    
    const pointer = this.fabricOverlay.fabricCanvas().getPointer(e.e);
    this.startPoint = { x: pointer.x, y: pointer.y };
    this.isDrawing = true;
    
    if (this.currentTool === 'text') {
      this.createTextShape(pointer.x, pointer.y);
      return;
    }
    
    this.activeShape = this.createDragShape(pointer.x, pointer.y);
    this.fabricOverlay.fabricCanvas().add(this.activeShape);
  }

  private onMouseMove(e: fabric.TPointerEventInfo) {
    if (!this.isDrawing || !this.startPoint || !this.activeShape) return;
    
    const pointer = this.fabricOverlay.fabricCanvas().getPointer(e.e);
    this.updateDragShape(this.startPoint, pointer);
    this.fabricOverlay.fabricCanvas().renderAll();
  }

  private onMouseUp(e: fabric.TPointerEventInfo) {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    this.startPoint = null;
    
    if (this.activeShape) {
      this.fabricOverlay.fabricCanvas().setActiveObject(this.activeShape);
      this.activeShape = null;
    }
  }

  private createDragShape(x: number, y: number): fabric.Object {
    const commonProps = {
      left: x,
      top: y,
      fill: this.currentColor + '40',
      stroke: this.currentColor,
      strokeWidth: 2,
    };

    switch (this.currentTool) {
      case 'rect':
        return new fabric.Rect({ ...commonProps, width: 1, height: 1 });
      case 'circle':
        return new fabric.Circle({ ...commonProps, radius: 1 });
      default:
        return new fabric.Rect({ ...commonProps, width: 1, height: 1 });
    }
  }

  private updateDragShape(start: { x: number; y: number }, current: { x: number; y: number }) {
    if (!this.activeShape) return;

    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);
    const left = Math.min(start.x, current.x);
    const top = Math.min(start.y, current.y);

    if (this.currentTool === 'rect') {
      (this.activeShape as fabric.Rect).set({ left, top, width, height });
    } else if (this.currentTool === 'circle') {
      const radius = Math.min(width, height) / 2;
      (this.activeShape as fabric.Circle).set({ 
        left: start.x - radius, 
        top: start.y - radius, 
        radius 
      });
    }
  }

  private createTextShape(x: number, y: number) {
    const shape = new fabric.FabricText('Sample Text', {
      left: x,
      top: y,
      fill: this.currentColor,
      fontSize: 20,
    });
    
    this.fabricOverlay.fabricCanvas().add(shape);
    this.fabricOverlay.fabricCanvas().setActiveObject(shape);
  }

  private clearAll() {
    this.fabricOverlay.clearFabric();
  }
}

// Initialize the demo app
new DemoApp();
