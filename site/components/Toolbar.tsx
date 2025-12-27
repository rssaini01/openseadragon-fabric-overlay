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
        <div className="toolbar">
            <div className="tool-group">
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

            <div className="tool-group">
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

            <div className="tool-group">
                <input
                    type="color"
                    id="colorPicker"
                    value={currentColor}
                    onInput={(e) => setCurrentColor((e.target as HTMLInputElement).value)}
                    title="Color"
                />
                <input
                    type="range"
                    id="brushSize"
                    min="1"
                    max="50"
                    value={brushSize}
                    onInput={(e) => setBrushSize(Number((e.target as HTMLInputElement).value))}
                    title="Brush Size"
                />
                <input
                    type="range"
                    id="opacity"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onInput={(e) => setOpacity(Number((e.target as HTMLInputElement).value))}
                    title="Opacity"
                />
            </div>

            <div className="tool-group">
                <button className="tool-btn" onClick={onDelete} title="Delete Selected">
                    ❌
                </button>
                <button className="tool-btn" onClick={onClearAll} title="Clear All">
                    🗑️
                </button>
                <button className="tool-btn" onClick={onExport} title="Export as PNG">
                    💾
                </button>
            </div>

            <div className="tool-group">
                <span style={{ fontSize: "14px", color: "#666", padding: "0 8px" }}>Objects: {objectCount}</span>
            </div>

            <div className="tool-group" style={{ marginLeft: "auto", fontSize: "12px", color: "#999" }}>
                <span>Shortcuts: Delete/Backspace (delete) | Ctrl+E (export)</span>
            </div>

            <div className="tool-group">
                <label>
                    <input
                        type="checkbox"
                        checked={exactSelection}
                        onChange={(e) => setExactSelection((e.target as HTMLInputElement).checked)}
                    />
                    {" "}Exact Selection
                </label>
                <button
                    className={`tool-btn ${selectAllMode ? "active" : ""}`}
                    onClick={() => setSelectAllMode(!selectAllMode)}
                    title="Select All at Point"
                >
                    🎯
                </button>
            </div>
        </div>
    );
}
