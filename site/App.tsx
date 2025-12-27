import { useState, useRef, useEffect } from "preact/hooks";
import { Header } from "./components/Header";
import { Toolbar } from "./components/Toolbar";
import { Viewer } from "./components/Viewer";
import type { FabricOverlay } from "openseadragon-fabric-overlay";

export type Tool = "select" | "draw" | "rect" | "circle" | "text";

export function App() {
  const [isFabricMode, setIsFabricMode] = useState(true);
  const [currentTool, setCurrentTool] = useState<Tool>("select");
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [exactSelection, setExactSelection] = useState(true);
  const [selectAllMode, setSelectAllMode] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const overlayRef = useRef<FabricOverlay | null>(null);

  const handleClearAll = () => {
    overlayRef.current?.clearFabric();
    setObjectCount(0);
  };

  const handleDelete = () => {
    const canvas = overlayRef.current?.fabricCanvas();
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      setObjectCount(canvas.getObjects().length);
    }
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    const canvas = overlayRef.current?.fabricCanvas();
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => obj.set({ opacity: newOpacity }));
      canvas.renderAll();
    }
  };

  const handleExport = () => {
    const canvas = overlayRef.current?.fabricCanvas();
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: 1 });
    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = dataURL;
    link.click();
  };

  const updateObjectCount = () => {
    const canvas = overlayRef.current?.fabricCanvas();
    if (canvas) setObjectCount(canvas.getObjects().length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFabricMode) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      }
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        handleExport();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isFabricMode]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header isFabricMode={isFabricMode} setIsFabricMode={setIsFabricMode} />
      {isFabricMode && (
        <Toolbar
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          opacity={opacity}
          setOpacity={handleOpacityChange}
          exactSelection={exactSelection}
          setExactSelection={setExactSelection}
          selectAllMode={selectAllMode}
          setSelectAllMode={setSelectAllMode}
          onClearAll={handleClearAll}
          onDelete={handleDelete}
          onExport={handleExport}
          objectCount={objectCount}
        />
      )}
      <div className="flex-1 relative overflow-hidden bg-black">
        <Viewer
          isFabricMode={isFabricMode}
          currentTool={currentTool}
          currentColor={currentColor}
          brushSize={brushSize}
          opacity={opacity}
          exactSelection={exactSelection}
          selectAllMode={selectAllMode}
          onOverlayReady={(overlay) => {
            overlayRef.current = overlay;
            const canvas = overlay.fabricCanvas();
            canvas.on("object:added", updateObjectCount);
            canvas.on("object:removed", updateObjectCount);
          }}
        />
      </div>
    </div>
  );
}
