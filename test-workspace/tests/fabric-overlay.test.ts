import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFabricOverlay, initOSDFabricOverlay } from 'openseadragon-fabric-overlay';

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
vi.mock('fabric', () => {
    const MockCanvas = vi.fn(function(this: any) {
        this.clear = vi.fn();
        this.renderAll = vi.fn();
        this.requestRenderAll = vi.fn();
        this.setDimensions = vi.fn();
        this.setZoom = vi.fn();
        this.absolutePan = vi.fn();
        this.discardActiveObject = vi.fn();
        this.dispose = vi.fn().mockResolvedValue(undefined);
        this.on = vi.fn();
        this.isDrawingMode = false;
        this.freeDrawingBrush = null;
    });

    const MockPoint = vi.fn(function(this: any, x: number, y: number) {
        this.x = x;
        this.y = y;
    });

    return {
        Canvas: MockCanvas,
        Point: MockPoint
    };
});

// Mock OpenSeadragon
vi.mock('openseadragon', () => {
    const MockPoint = vi.fn(function(this: any, x: number, y: number) {
        this.x = x;
        this.y = y;
    });

    return {
        default: {
            Point: MockPoint,
            getPageScroll: vi.fn(() => ({ x: 0, y: 0 }))
        }
    };
});

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
