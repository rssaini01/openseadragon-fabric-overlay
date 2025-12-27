import type { Tool } from "../App";

interface ToolbarProps {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  exactSelection: boolean;
  setExactSelection: (exact: boolean) => void;
  selectAllMode: boolean;
  setSelectAllMode: (mode: boolean) => void;
  onClearAll: () => void;
  onDelete: () => void;
  onExport: () => void;
  objectCount: number;
}

export function Toolbar({
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  opacity,
  setOpacity,
  exactSelection,
  setExactSelection,
  selectAllMode,
  setSelectAllMode,
  onClearAll,
  onDelete,
  onExport,
  objectCount,
}: Readonly<ToolbarProps>) {
  return (
    <div className="bg-white px-6 py-4 shadow-md border-b border-gray-200 animate-fade-in">
      <div className="flex gap-6 items-center flex-wrap">
        {/* Drawing Tools */}
        <div className="flex gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase">Tools</span>
          <button
            className={`tool-btn ${currentTool === "select" ? "active" : ""}`}
            onClick={() => setCurrentTool("select")}
            title="Select"
          >
            ✋
          </button>
          <button
            className={`tool-btn ${currentTool === "draw" ? "active" : ""}`}
            onClick={() => setCurrentTool("draw")}
            title="Freehand Draw"
          >
            ✏️
          </button>
        </div>

        {/* Shape Tools */}
        <div className="flex gap-2 items-center border-l pl-6 border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase">Shapes</span>
          <button
            className={`tool-btn ${currentTool === "rect" ? "active" : ""}`}
            onClick={() => setCurrentTool("rect")}
            title="Rectangle"
          >
            ⬜
          </button>
          <button
            className={`tool-btn ${currentTool === "circle" ? "active" : ""}`}
            onClick={() => setCurrentTool("circle")}
            title="Circle"
          >
            ⭕
          </button>
          <button
            className={`tool-btn ${currentTool === "text" ? "active" : ""}`}
            onClick={() => setCurrentTool("text")}
            title="Text"
          >
            T
          </button>
        </div>

        {/* Style Controls */}
        <div className="flex gap-3 items-center border-l pl-6 border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase">Style</span>
          <div className="flex flex-col gap-1">
            <label for={"color"} className="text-xs text-gray-600">Color</label>
            <input
              id={"color"}
              type="color"
              value={currentColor}
              onInput={(e) => setCurrentColor((e.target as HTMLInputElement).value)}
              className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Size: {brushSize}</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onInput={(e) => setBrushSize(Number((e.target as HTMLInputElement).value))}
              className="w-24 accent-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Opacity: {opacity.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onInput={(e) => setOpacity(Number((e.target as HTMLInputElement).value))}
              className="w-24 accent-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center border-l pl-6 border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase">Actions</span>
          <button
            className="tool-btn hover:bg-red-50 hover:border-red-500"
            onClick={onDelete}
            title="Delete Selected"
          >
            ❌
          </button>
          <button
            className="tool-btn hover:bg-orange-50 hover:border-orange-500"
            onClick={onClearAll}
            title="Clear All"
          >
            🗑️
          </button>
          <button
            className="tool-btn hover:bg-green-50 hover:border-green-500"
            onClick={onExport}
            title="Export as PNG"
          >
            💾
          </button>
        </div>

        {/* Selection Options */}
        <div className="flex gap-3 items-center border-l pl-6 border-gray-200">
          <label
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox" checked={exactSelection}
              onChange={(e) => setExactSelection((e.target as HTMLInputElement).checked)}
              className="w-4 h-4 accent-blue-500" />
            Exact Selection
          </label>
          <button
            className={`tool-btn ${selectAllMode ? "active" : ""}`}
            onClick={() => setSelectAllMode(!selectAllMode)}
            title="Select All at Point"
          >
            🎯
          </button>
        </div>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-4 border-l pl-6 border-gray-200">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <span className="text-xs font-semibold text-blue-600">Objects:</span>
            <span className="text-sm font-bold text-blue-700">{objectCount}</span>
          </div>
          <div className="text-xs text-gray-500">
            <div>⌨️ Delete/Backspace • Ctrl+E</div>
          </div>
        </div>
      </div>
    </div>
  );
}
