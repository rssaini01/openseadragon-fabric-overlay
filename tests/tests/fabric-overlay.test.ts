import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fabric - must be before imports
vi.mock('fabric', () => {
    const MockCanvas = vi.fn(function (this: any) {
        this.clear = vi.fn();
        this.renderAll = vi.fn();
        this.requestRenderAll = vi.fn();
        this.setDimensions = vi.fn();
        this.setZoom = vi.fn();
        this.absolutePan = vi.fn();
        this.discardActiveObject = vi.fn();
        this.dispose = vi.fn().mockResolvedValue(undefined);
        this.on = vi.fn();
        this.off = vi.fn();
        this.set = vi.fn();
        this.getObjects = vi.fn(() => []);
        this.setActiveObject = vi.fn();
        this.add = vi.fn();
        this.remove = vi.fn();
        this.isDrawingMode = false;
        this.freeDrawingBrush = null;
        this.perPixelTargetFind = false;
        this.targetFindTolerance = 4;
        this.selection = true;
    });

    const MockPoint = vi.fn(function (this: any, x: number, y: number) {
        this.x = x;
        this.y = y;
    });

    const MockActiveSelection = vi.fn(function (this: any) {});

    return {
        Canvas: MockCanvas,
        Point: MockPoint,
        ActiveSelection: MockActiveSelection
    };
});

// Mock OpenSeadragon - must be before imports
vi.mock('openseadragon', () => {
    const MockPoint = vi.fn(function (this: any, x: number, y: number) {
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
            setRotation: vi.fn(),
            getContentSize: vi.fn(() => ({ x: 1000, y: 1000 }))
        }))
    }
};

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

        it('should create with custom config', () => {
            const overlay = createFabricOverlay(mockViewer as any, {
                fabricCanvasOptions: { selection: true },
                enableAutoResize: false,
                enableMouseEvents: false
            });
            expect(overlay).toBeDefined();
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

        it('should clear selection in drawing mode', () => {
            overlay.fabricCanvas().isDrawingMode = true;
            overlay.clearSelection();
            expect(overlay.fabricCanvas().isDrawingMode).toBe(false);
        });

        it('should set drawing mode', () => {
            const mockBrush = {} as any;
            overlay.setDrawingMode(true, mockBrush);
            expect(overlay.fabricCanvas().isDrawingMode).toBe(true);
            expect(overlay.fabricCanvas().freeDrawingBrush).toBe(mockBrush);
        });

        it('should set drawing mode without brush', () => {
            overlay.setDrawingMode(true);
            expect(overlay.fabricCanvas().isDrawingMode).toBe(true);
        });

        it('should set exact selection', () => {
            overlay.setExactSelection(true);
            expect(overlay.fabricCanvas().perPixelTargetFind).toBe(true);
            expect(overlay.fabricCanvas().targetFindTolerance).toBe(0);
        });

        it('should disable exact selection', () => {
            overlay.setExactSelection(false);
            expect(overlay.fabricCanvas().perPixelTargetFind).toBe(false);
            expect(overlay.fabricCanvas().targetFindTolerance).toBe(4);
        });

        it('should update canvas rotation', () => {
            const setRotation = vi.fn();
            mockViewer.world.getItemAt = vi.fn(() => ({ setRotation } as any));
            overlay.updateCanvasRotation(90);
            expect(setRotation).toHaveBeenCalledWith(90, true);
        });

        it('should not update rotation for invalid degrees', () => {
            const setRotation = vi.fn();
            mockViewer.world.getItemAt = vi.fn(() => ({ setRotation } as any));
            overlay.updateCanvasRotation(-10);
            overlay.updateCanvasRotation(400);
            expect(setRotation).not.toHaveBeenCalled();
        });

        it('should select all at point', () => {
            const mockObj = { containsPoint: vi.fn(() => true) };
            overlay.fabricCanvas().getObjects = vi.fn(() => [mockObj]);

            const result = overlay.selectAllAtPoint(100, 100);
            expect(result).toHaveLength(1);
        });

        it('should return empty array when no objects at point', () => {
            overlay.fabricCanvas().getObjects = vi.fn(() => []);
            const result = overlay.selectAllAtPoint(100, 100);
            expect(result).toHaveLength(0);
        });

        it('should destroy overlay', () => {
            overlay.destroy();
            expect(overlay.isDestroyed).toBe(true);
            expect(() => overlay.clear()).toThrow('FabricOverlay has been destroyed');
        });

        it('should not destroy twice', () => {
            overlay.destroy();
            overlay.destroy();
            expect(overlay.isDestroyed).toBe(true);
        });
    });

    describe('Backward compatibility methods', () => {
        let overlay: any;

        beforeEach(() => {
            overlay = createFabricOverlay(mockViewer as any);
        });

        it('should return viewer', () => {
            expect(overlay.viewer()).toBe(mockViewer);
        });

        it('should return canvas element', () => {
            expect(overlay.canvas()).toBeDefined();
        });

        it('should clear fabric', () => {
            overlay.clearFabric();
            expect(overlay.fabricCanvas().clear).toHaveBeenCalled();
        });

        it('should render all fabric', () => {
            overlay.renderAllFabric();
            expect(overlay.fabricCanvas().renderAll).toHaveBeenCalled();
        });

        it('should clear fabric selection', () => {
            overlay.clearFabricSelection();
            expect(overlay.fabricCanvas().discardActiveObject).toHaveBeenCalled();
        });

        it('should set viewer mouse nav enabled', () => {
            overlay.setViewerMouseNavEnabled(false);
            expect(mockViewer.setMouseNavEnabled).toHaveBeenCalledWith(false);
        });

        it('should set viewer mouse nav enabled default true', () => {
            overlay.setViewerMouseNavEnabled();
            expect(mockViewer.setMouseNavEnabled).toHaveBeenCalledWith(true);
        });

        it('should resize canvas', () => {
            overlay.resizeCanvas();
            expect(overlay.canvas()).toBeDefined();
        });

        it('should resize fabric', () => {
            overlay.resizeFabric();
            expect(overlay.fabricCanvas().setDimensions).toHaveBeenCalled();
        });
    });

    describe('Constrain to image', () => {
        let overlay: any;

        beforeEach(() => {
            mockViewer.world.getItemAt = vi.fn(() => ({
                setRotation: vi.fn(),
                getContentSize: vi.fn(() => ({ x: 1000, y: 1000 }))
            }));
            overlay = createFabricOverlay(mockViewer as any, { constrainToImage: true });
        });

        it('should enable constrain to image', () => {
            overlay.setConstrainToImage(true);
            expect(overlay.fabricCanvas().on).toHaveBeenCalled();
        });

        it('should disable constrain to image', () => {
            overlay.setConstrainToImage(false);
            expect(overlay.fabricCanvas().off).toHaveBeenCalled();
        });
    });
});
