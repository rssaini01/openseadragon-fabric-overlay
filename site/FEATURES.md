# Demo Features

## New Features Added

### 1. **Delete Selected Objects** ❌

- Click the ❌ button to delete selected objects
- Keyboard shortcut: `Delete` or `Backspace`
- Works with single or multiple selected objects

### 2. **Export Canvas as PNG** 💾

- Click the 💾 button to export the canvas
- Keyboard shortcut: `Ctrl + E`
- Downloads as `canvas-export.png`

### 3. **Object Counter** 📊

- Real-time display of total objects on canvas
- Updates automatically when objects are added/removed
- Located in the toolbar

### 4. **Opacity Control** 🎨

- Slider to control opacity (0.0 - 1.0)
- Apply to new shapes as you draw
- Change opacity of selected objects

### 5. **Keyboard Shortcuts** ⌨️

- `Delete` / `Backspace` - Delete selected objects
- `Ctrl + E` - Export canvas as PNG
- Shortcuts only work in Fabric Mode

### 6. **Visual Feedback**

- Active tool highlighting
- Object count display
- Keyboard shortcuts hint in toolbar

## Usage

### Drawing with Opacity

1. Select a tool (rect, circle, text)
2. Adjust the opacity slider
3. Draw on the canvas - new objects will have the set opacity

### Changing Opacity of Existing Objects

1. Select one or more objects
2. Adjust the opacity slider
3. Selected objects will update in real-time

### Exporting

1. Draw your annotations
2. Click the 💾 button or press `Ctrl + E`
3. Image will download automatically

### Deleting Objects

1. Select objects (click or drag to select multiple)
2. Click ❌ button or press `Delete`/`Backspace`
3. Objects will be removed from canvas

## Technical Implementation

- **State Management**: All features use Preact hooks
- **Event Listeners**: Canvas events for object tracking
- **Keyboard Shortcuts**: Global event listeners with cleanup
- **Export**: Uses Fabric.js `toDataURL()` method
- **Opacity**: Applied to both new and existing objects
