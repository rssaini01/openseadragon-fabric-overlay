interface HeaderProps {
    isFabricMode: boolean;
    setIsFabricMode: (mode: boolean) => void;
}

export function Header({ isFabricMode, setIsFabricMode }: Readonly<HeaderProps>) {
    return (
        <header className="header">
            <h1>OpenSeadragon + Fabric Overlay</h1>
            <div className="mode-toggle">
                <button
                    className={`mode-btn ${isFabricMode ? "active" : ""}`}
                    onClick={() => setIsFabricMode(true)}
                >
                    Fabric Mode
                </button>
                <button
                    className={`mode-btn ${isFabricMode ? "" : "active"}`}
                    onClick={() => setIsFabricMode(false)}
                >
                    Navigation Mode
                </button>
            </div>
        </header>
    );
}
