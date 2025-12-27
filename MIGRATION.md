# Demo Site Migration to Preact

## Summary

Successfully migrated the OpenSeadragon Fabric Overlay demo site from vanilla TypeScript to **Preact** with proper state management and component architecture.

## Changes Made

### 1. Dependencies
- Added `preact@^10.24.3`
- Added `@preact/preset-vite@^2.9.2`
- Added `typescript@^5.7.3`

### 2. Project Structure
```
site/
├── components/
│   ├── Header.tsx       # Mode toggle component
│   ├── Toolbar.tsx      # Drawing tools and controls
│   └── Viewer.tsx       # OpenSeadragon + Fabric integration
├── App.tsx              # Main app with state management
├── main.tsx             # Preact entry point
├── index.html           # Simplified HTML
└── vite.config.ts       # Updated with Preact plugin
```

### 3. State Management
All application state is now managed using Preact hooks in `App.tsx`:

- **isFabricMode**: Toggle between Fabric and Navigation modes
- **currentTool**: Active drawing tool (select, draw, rect, circle, text)
- **currentColor**: Color for shapes and drawing
- **brushSize**: Brush size for freehand drawing
- **exactSelection**: Enable/disable exact selection mode
- **selectAllMode**: Toggle select all at point mode

### 4. Component Architecture

#### Header Component
- Displays title and mode toggle buttons
- Props: `isFabricMode`, `setIsFabricMode`

#### Toolbar Component
- All drawing tools and controls
- Props: tool state, color, brush size, selection options, clear callback
- Only visible in Fabric mode

#### Viewer Component
- OpenSeadragon viewer initialization
- Fabric overlay integration
- Mouse event handling for drawing
- Props: all state values needed for drawing behavior

### 5. Benefits

✅ **Better State Management**: Centralized state with Preact hooks
✅ **Component Reusability**: Modular, reusable components
✅ **Type Safety**: Full TypeScript support
✅ **Maintainability**: Clear separation of concerns
✅ **Reactivity**: Automatic UI updates on state changes
✅ **Smaller Bundle**: Preact is only 3KB

## Running the Demo

```bash
# Development
cd site
npm install
npm run dev

# Production Build
npm run build
```

## Migration Notes

- All functionality from the original vanilla TypeScript version is preserved
- The UI and styling remain unchanged
- Drawing behavior is identical to the original implementation
- Added proper cleanup in useEffect hooks
