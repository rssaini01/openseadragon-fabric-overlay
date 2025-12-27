interface HeaderProps {
  isFabricMode: boolean;
  setIsFabricMode: (mode: boolean) => void;
}

export function Header({ isFabricMode, setIsFabricMode }: Readonly<HeaderProps>) {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 shadow-lg animate-slide-down">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          OpenSeadragon + Fabric Overlay
        </h1>
        <div className="flex gap-3">
          <button
            className={`mode-btn ${isFabricMode ? "active" : ""}`}
            onClick={() => setIsFabricMode(true)}
          >
            🎨 Fabric Mode
          </button>
          <button
            className={`mode-btn ${isFabricMode ? "" : "active"}`}
            onClick={() => setIsFabricMode(false)}
          >
            🧭 Navigation Mode
          </button>
        </div>
      </div>
    </header>
  );
}
