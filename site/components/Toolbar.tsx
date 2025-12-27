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
}: Readonly<ToolbarProps>) {
  return (
    <aside className="w-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col items-center py-4 gap-4 border-r border-slate-700">
      {/* Tools Section */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-400 text-center mb-1">TOOLS</div>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl transition-all duration-300 ${
            currentTool === "select"
              ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 scale-110"
              : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
          }`}
          onClick={() => setCurrentTool("select")}
          title="Select"
        >
          ✋
        </button>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl transition-all duration-300 ${
            currentTool === "draw"
              ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 scale-110"
              : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
          }`}
          onClick={() => setCurrentTool("draw")}
          title="Draw"
        >
          ✏️
        </button>
      </div>

      <div className="w-10 h-px bg-slate-700"></div>

      {/* Shapes Section */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-400 text-center mb-1">SHAPES</div>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl transition-all duration-300 ${
            currentTool === "rect"
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 scale-110"
              : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
          }`}
          onClick={() => setCurrentTool("rect")}
          title="Rectangle"
        >
          ⬜
        </button>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl transition-all duration-300 ${
            currentTool === "circle"
              ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 scale-110"
              : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
          }`}
          onClick={() => setCurrentTool("circle")}
          title="Circle"
        >
          ⭕
        </button>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${
            currentTool === "text"
              ? "bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/50 scale-110"
              : "bg-slate-700/50 hover:bg-slate-600 hover:scale-105"
          }`}
          onClick={() => setCurrentTool("text")}
          title="Text"
        >
          T
        </button>
      </div>

      <div className="w-10 h-px bg-slate-700"></div>

      {/* Style Section */}
      <div className="flex flex-col gap-2 items-center">
        <div className="text-xs font-bold text-slate-400 text-center mb-1">STYLE</div>
        <div className="relative group">
          <input
            type="color"
            value={currentColor}
            onInput={(e) => setCurrentColor((e.target as HTMLInputElement).value)}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-slate-700 hover:border-slate-500 transition-all"
            title="Color"
          />
        </div>
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="text-xs text-slate-400">Size</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setBrushSize(Number(target.value));
              const percent = ((Number(target.value) - 1) / (50 - 1)) * 100;
              target.style.background = `linear-gradient(to right, rgb(59 130 246) ${percent}%, rgb(51 65 85) ${percent}%)`;
            }}
            className="w-12 accent-blue-500 cursor-pointer"
            style={{ background: `linear-gradient(to right, rgb(59 130 246) ${((brushSize - 1) / (50 - 1)) * 100}%, rgb(51 65 85) ${((brushSize - 1) / (50 - 1)) * 100}%)` }}
          />
          <span className="text-xs text-blue-400 font-bold">{brushSize}</span>
        </div>
        <div className="flex flex-col items-center gap-1 w-full">
          <span className="text-xs text-slate-400">Opacity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setOpacity(Number(target.value));
              const percent = (Number(target.value) / 1) * 100;
              target.style.background = `linear-gradient(to right, rgb(168 85 247) ${percent}%, rgb(51 65 85) ${percent}%)`;
            }}
            className="w-12 accent-purple-500 cursor-pointer"
            style={{ background: `linear-gradient(to right, rgb(168 85 247) ${(opacity / 1) * 100}%, rgb(51 65 85) ${(opacity / 1) * 100}%)` }}
          />
          <span className="text-xs text-purple-400 font-bold">{opacity.toFixed(1)}</span>
        </div>
      </div>
    </aside>
  );
}
