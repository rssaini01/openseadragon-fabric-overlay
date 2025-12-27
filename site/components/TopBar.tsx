interface TopBarProps {
  onDelete: () => void;
  onClearAll: () => void;
  onExport: () => void;
  objectCount: number;
  exactSelection: boolean;
  setExactSelection: (exact: boolean) => void;
  selectAllMode: boolean;
  setSelectAllMode: (mode: boolean) => void;
  constrainToImage: boolean;
  setConstrainToImage: (enabled: boolean) => void;
}

export function TopBar({
  onDelete,
  onClearAll,
  onExport,
  objectCount,
  exactSelection,
  setExactSelection,
  selectAllMode,
  setSelectAllMode,
  constrainToImage,
  setConstrainToImage,
}: Readonly<TopBarProps>) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center gap-4 shadow-lg animate-slide-down">
      {/* Actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase">Actions</span>
        <button
          className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 rounded-md text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md shadow-red-500/30 flex items-center gap-1.5"
          onClick={onDelete}
          title="Delete Selected (Del)"
        >
          ❌ Delete
        </button>
        <button
          className="px-3 py-1.5 bg-orange-600/80 hover:bg-orange-500 rounded-md text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md shadow-orange-500/30 flex items-center gap-1.5"
          onClick={onClearAll}
          title="Clear All"
        >
          🗑️ Clear
        </button>
        <button
          className="px-3 py-1.5 bg-green-600/80 hover:bg-green-500 rounded-md text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md shadow-green-500/30 flex items-center gap-1.5"
          onClick={onExport}
          title="Export PNG (Ctrl+E)"
        >
          💾 Export
        </button>
      </div>

      <div className="w-px h-6 bg-slate-700"></div>

      {/* Selection Options */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase">Selection</span>
        <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-md cursor-pointer transition-all text-sm">
          <input
            type="checkbox"
            checked={exactSelection}
            onChange={(e) => setExactSelection((e.target as HTMLInputElement).checked)}
            className="w-3.5 h-3.5 accent-blue-500"
          />
          <span className="text-white">Exact</span>
        </label>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
            selectAllMode
              ? "bg-purple-600 shadow-md shadow-purple-500/50 text-white"
              : "bg-slate-700/50 hover:bg-slate-700 text-slate-300"
          }`}
          onClick={() => setSelectAllMode(!selectAllMode)}
          title="Select All Mode"
        >
          🔘 Select All
        </button>
      </div>

      <div className="w-px h-6 bg-slate-700"></div>

      {/* Constraints */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase">Constraints</span>
        <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-md cursor-pointer transition-all text-sm">
          <input
            type="checkbox"
            checked={constrainToImage}
            onChange={(e) => setConstrainToImage((e.target as HTMLInputElement).checked)}
            className="w-3.5 h-3.5 accent-emerald-500"
          />
          <span className="text-white">Constrain to Image</span>
        </label>
      </div>

      <div className="flex-1"></div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-md">
          <span className="text-xs font-semibold text-blue-400">Objects:</span>
          <span className="text-lg font-bold text-blue-300">{objectCount}</span>
        </div>
        <div className="text-xs text-slate-400">
          ⌨️ Esc • Del • Ctrl+E
        </div>
      </div>
    </div>
  );
}
