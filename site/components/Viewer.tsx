import { useEffect, useRef } from "preact/hooks";
import OpenSeadragon from "openseadragon";
import { FabricOverlay, initOSDFabricOverlay } from "openseadragon-fabric-overlay";
import * as fabric from "fabric";
import type { Tool } from "../App";

interface ViewerProps {
  isFabricMode: boolean;
  currentTool: Tool;
  currentColor: string;
  brushSize: number;
  opacity: number;
  exactSelection: boolean;
  selectAllMode: boolean;
  onOverlayReady: (overlay: FabricOverlay) => void;
}

export function Viewer({
  isFabricMode,
  currentTool,
  currentColor,
  brushSize,
  opacity,
  exactSelection,
  selectAllMode,
  onOverlayReady,
}: Readonly<ViewerProps>) {
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const overlayRef = useRef<FabricOverlay | null>(null);
  const drawStateRef = useRef({
    isDrawing: false,
    startPoint: null as { x: number; y: number } | null,
    activeShape: null as fabric.Object | null
  });
  const propsRef = useRef({ isFabricMode, currentTool, currentColor, opacity, selectAllMode });

  useEffect(() => {
    propsRef.current = { isFabricMode, currentTool, currentColor, opacity, selectAllMode };
  }, [isFabricMode, currentTool, currentColor, opacity, selectAllMode]);

  useEffect(() => {
    if (!viewerRef.current) {
      viewerRef.current = OpenSeadragon({
        id: "openseadragon",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
        showNavigationControl: false,
        crossOriginPolicy: "Anonymous",
      });

      overlayRef.current = initOSDFabricOverlay(viewerRef.current, { fabricCanvasOptions: { selection: true } }, "1");
      overlayRef.current.setExactSelection(true);
      onOverlayReady(overlayRef.current);

      const canvas = overlayRef.current.fabricCanvas();

      canvas.on("mouse:down", (e: fabric.TPointerEventInfo) => {
        const { isFabricMode, currentTool, currentColor, opacity, selectAllMode } = propsRef.current;
        if (!isFabricMode || currentTool === "draw" || !overlayRef.current) return;

        if (selectAllMode) {
          const pointer = overlayRef.current.fabricCanvas().getScenePoint(e.e);
          overlayRef.current.selectAllAtPoint(pointer.x, pointer.y);
          return;
        }

        if (e.target || currentTool === "select") return;

        const pointer = overlayRef.current.fabricCanvas().getScenePoint(e.e);
        drawStateRef.current.startPoint = { x: pointer.x, y: pointer.y };
        drawStateRef.current.isDrawing = true;

        if (currentTool === "text") {
          const text = new fabric.FabricText("Sample Text", {
            left: pointer.x,
            top: pointer.y,
            fill: currentColor,
            fontSize: 20,
            opacity
          });
          overlayRef.current.fabricCanvas().add(text);
          overlayRef.current.fabricCanvas().setActiveObject(text);
          return;
        }

        const props = {
          left: pointer.x,
          top: pointer.y,
          fill: currentColor + "40",
          stroke: currentColor,
          strokeWidth: 2,
          opacity
        };
        drawStateRef.current.activeShape = currentTool === "circle" ? new fabric.Circle({
          ...props,
          radius: 1
        }) : new fabric.Rect({ ...props, width: 1, height: 1 });
        overlayRef.current.fabricCanvas().add(drawStateRef.current.activeShape);
      });

      canvas.on("mouse:move", (e: fabric.TPointerEventInfo) => {
        const { currentTool } = propsRef.current;
        if (!drawStateRef.current.isDrawing || !drawStateRef.current.startPoint || !drawStateRef.current.activeShape || !overlayRef.current) return;

        const pointer = overlayRef.current.fabricCanvas().getScenePoint(e.e);
        const start = drawStateRef.current.startPoint;
        const width = Math.abs(pointer.x - start.x);
        const height = Math.abs(pointer.y - start.y);
        const left = Math.min(start.x, pointer.x);
        const top = Math.min(start.y, pointer.y);

        if (currentTool === "rect") {
          (drawStateRef.current.activeShape as fabric.Rect).set({ left, top, width, height });
        } else if (currentTool === "circle") {
          const radius = Math.min(width, height) / 2;
          (drawStateRef.current.activeShape as fabric.Circle).set({
            left: start.x - radius,
            top: start.y - radius,
            radius
          });
        }
        overlayRef.current.fabricCanvas().renderAll();
      });

      canvas.on("mouse:up", () => {
        if (!drawStateRef.current.isDrawing || !overlayRef.current) return;

        drawStateRef.current.isDrawing = false;
        drawStateRef.current.startPoint = null;

        if (drawStateRef.current.activeShape) {
          overlayRef.current.fabricCanvas().setActiveObject(drawStateRef.current.activeShape);
          drawStateRef.current.activeShape = null;
        }
      });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.setViewerMouseNavEnabled(!isFabricMode);
    if (!isFabricMode) overlayRef.current.fabricCanvas().isDrawingMode = false;
  }, [isFabricMode]);

  useEffect(() => {
    if (!overlayRef.current) return;
    const canvas = overlayRef.current.fabricCanvas();

    if (currentTool === "draw") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = currentColor;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [currentTool, currentColor, brushSize]);

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.setExactSelection(exactSelection);
  }, [exactSelection]);

  return <div id="openseadragon" style={{ width: "100%", height: "100%" }} />;
}
