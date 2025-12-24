import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFabricOverlay, initOSDFabricOverlay } from '../../src/fabric-overlay';

// Mock OpenSeadragon
const mockViewer = {
  addHandler: vi.fn(),
  removeHandler: vi.fn(),
  setMouseNavEnabled: vi.fn(),
  canvas: document.createElement('div'),
  container: { clientWidth: 800, clientHeight: 600 },
  viewport: {
    getZoom: vi.fn(() => 1),
    viewportToImageZoom: vi.fn(() => 1),
    viewportToWindowCoordinates: vi.fn(() => ({ x: 0, y: 0 }))
  },
  world: {
    getItemAt: vi.fn(() => ({
      setRotation: vi.fn()
    }))
  }
};

// Mock fabric
vi.mock('fabric', () => ({
  Canvas: vi.fn(() => ({
    clear: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    setDimensions: vi.fn(),
    setZoom: vi.fn(),
    absolutePan: vi.fn(),
    discardActiveObject: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: null
  })),
  Point: vi.fn((x, y) => ({ x, y }))
}));

// Mock OpenSeadragon
vi.mock('openseadragon', () => ({
  default: {
    Point: vi.fn((x, y) => ({ x, y })),
    getPageScroll: vi.fn(() => ({ x: 0, y: 0 }))
  }
}));

describe('FabricOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('createFabricOverlay', () => {
    it('should create overlay instance', () => {
      const overlay = createFabricOverlay(mockViewer as any);
      expect(overlay).toBeDefined();
      expect(overlay.isDestroyed).toBe(false);
    });

    it('should throw error for invalid viewer', () => {
      expect(() => createFabricOverlay(null as any)).toThrow('Invalid OpenSeadragon viewer instance');
    });

    it('should use default config', () => {
      const overlay = createFabricOverlay(mockViewer as any);
      expect(overlay.fabricCanvas()).toBeDefined();
    });
  });

  describe('initOSDFabricOverlay', () => {
    it('should create overlay with legacy function', () => {
      const overlay = initOSDFabricOverlay(mockViewer as any, {}, 'test');
      expect(overlay).toBeDefined();
    });
  });

  describe('FabricOverlay methods', () => {
    let overlay: any;

    beforeEach(() => {
      overlay = createFabricOverlay(mockViewer as any);
    });

    it('should clear canvas', () => {
      overlay.clear();
      expect(overlay.fabricCanvas().clear).toHaveBeenCalled();
    });

    it('should render canvas', () => {
      overlay.render();
      expect(overlay.fabricCanvas().renderAll).toHaveBeenCalled();
    });

    it('should set mouse navigation', () => {
      overlay.setMouseNavigation(false);
      expect(mockViewer.setMouseNavEnabled).toHaveBeenCalledWith(false);
    });

    it('should clear selection', () => {
      overlay.clearSelection();
      expect(overlay.fabricCanvas().discardActiveObject).toHaveBeenCalled();
    });

    it('should destroy overlay', () => {
      overlay.destroy();
      expect(overlay.isDestroyed).toBe(true);
      expect(() => overlay.clear()).toThrow('FabricOverlay has been destroyed');
    });
  });
});