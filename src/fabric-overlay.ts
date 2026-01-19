import {
    Canvas,
    Point,
    ActiveSelection,
    FabricObject,
    PencilBrush,
    type CanvasOptions,
    type TPointerEventInfo
} from "fabric";
import OpenSeadragon from "openseadragon";

export interface FabricOverlayConfig {
    fabricCanvasOptions?: Partial<CanvasOptions>;
    enableAutoResize?: boolean;
    enableMouseEvents?: boolean;
    constrainToImage?: boolean;
}

export interface FabricOverlayEvents {
    'canvas:ready': () => void;
    'canvas:resized': (dimensions: { width: number; height: number }) => void;
    'viewport:updated': () => void;
}

class FabricOverlay {
    private readonly _viewer: OpenSeadragon.Viewer;
    private _canvas!: HTMLCanvasElement;
    private readonly _fabricCanvas!: Canvas;
    private readonly _config: Required<FabricOverlayConfig>;

    private readonly _id: string;
    private _imageBounds: { left: number; top: number; width: number; height: number } | null = null;
    private _containerWidth = 0;
    private _containerHeight = 0;
    private _canvasDiv!: HTMLDivElement;
    private _isDestroyed = false;
    private readonly _eventListeners = new Map<string, () => void>();

    // Backward compatibility methods
    viewer(): OpenSeadragon.Viewer {
        return this._viewer;
    }

    canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    fabricCanvas(): Canvas {
        this._checkDestroyed();
        return this._fabricCanvas;
    }

    clearFabric(): void {
        this.clear();
    }

    renderAllFabric(): void {
        this.render();
    }

    resizeCanvas(): void {
        this._resizeCanvas();
    }

    resizeFabric(): void {
        this._syncFabricWithViewport();
    }

    clearFabricSelection(): void {
        this.clearSelection();
    }

    setViewerMouseNavEnabled(state = true): void {
        this.setMouseNavigation(state);
    }

    updateCanvasRotation(deg: number): void {
        if (deg < 0 || deg > 360) return;
        this._viewer.world.getItemAt(0).setRotation(deg, true);
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    clear(): void {
        this._checkDestroyed();
        this._fabricCanvas.clear();
    }

    render(): void {
        this._checkDestroyed();
        this._fabricCanvas.renderAll();
    }

    private _checkDestroyed(): void {
        if (this._isDestroyed) {
            throw new Error('FabricOverlay has been destroyed');
        }
    }

    private _resizeCanvas(): void {
        const { clientWidth, clientHeight } = this._viewer.container;
        let resized = false;

        if (this._containerWidth !== clientWidth) {
            this._containerWidth = clientWidth;
            this._canvas.width = clientWidth;
            resized = true;
        }

        if (this._containerHeight !== clientHeight) {
            this._containerHeight = clientHeight;
            this._canvas.height = clientHeight;
            resized = true;
        }

        if (resized) {
            this._emit('canvas:resized', { width: this._containerWidth, height: this._containerHeight });
        }
    }

    private _syncFabricWithViewport(): void {
        const viewport = this._viewer.viewport;
        const origin = new OpenSeadragon.Point(0, 0);
        const viewportZoom = viewport.getZoom(true);
        const zoom = viewport.viewportToImageZoom(viewportZoom);

        this._fabricCanvas.setDimensions({
            width: this._containerWidth,
            height: this._containerHeight
        });
        this._fabricCanvas.setZoom(zoom);

        const viewportWindowPoint = viewport.viewportToWindowCoordinates(origin);
        const canvasOffset = this._canvasDiv.getBoundingClientRect();
        const pageScroll = OpenSeadragon.getPageScroll();

        this._fabricCanvas.absolutePan(
            new Point(
                canvasOffset.left - Math.round(viewportWindowPoint.x) + pageScroll.x,
                canvasOffset.top - Math.round(viewportWindowPoint.y) + pageScroll.y
            )
        );
    }

    clearSelection(): void {
        this._checkDestroyed();
        if (this._fabricCanvas.isDrawingMode) {
            this._fabricCanvas.isDrawingMode = false;
        }
        this._fabricCanvas.discardActiveObject();
        this._fabricCanvas.requestRenderAll();
    }

    setMouseNavigation(enabled: boolean): void {
        this._viewer.setMouseNavEnabled(enabled);
    }

    setDrawingMode(enabled: boolean, brush?: PencilBrush): void {
        this._checkDestroyed();
        this._fabricCanvas.isDrawingMode = enabled;
        if (enabled && brush) {
            this._fabricCanvas.freeDrawingBrush = brush;
        }
    }

    setExactSelection(enabled: boolean): void {
        this._checkDestroyed();
        this._fabricCanvas.perPixelTargetFind = enabled;
        this._fabricCanvas.targetFindTolerance = enabled ? 0 : 4;
    }

    setConstrainToImage(enabled: boolean): void {
        this._checkDestroyed();
        this._config.constrainToImage = enabled;
        if (enabled) {
            this._setupConstraintHandlers();
            this._updateImageBounds();
            this._fabricCanvas.set({ stopTransformOnLimit: true } as any);
        } else {
            this._removeConstraintHandlers();
            this._fabricCanvas.set({ stopTransformOnLimit: false } as any);
        }
    }

    selectAllAtPoint(x: number, y: number): FabricObject[] {
        this._checkDestroyed();
        const objects = this._fabricCanvas.getObjects().filter(obj =>
            obj.containsPoint(new Point(x, y))
        );
        if (objects.length > 0) {
            const selection = new ActiveSelection(objects, {
                canvas: this._fabricCanvas
            });
            this._fabricCanvas.setActiveObject(selection);
            this._fabricCanvas.requestRenderAll();
        }
        return objects;
    }

    destroy(): void {
        if (this._isDestroyed) return;

        this._isDestroyed = true;
        this._eventListeners.forEach((cleanup) => cleanup());
        this._eventListeners.clear();

        void this._fabricCanvas.dispose();
        this._canvasDiv.remove();
    }

    private _emit(_event: keyof FabricOverlayEvents, _data?: any): void {
        // Simple event emission - could be enhanced with proper event system
    }

    constructor(
        viewer: OpenSeadragon.Viewer,
        config: FabricOverlayConfig,
        id: string
    ) {
        this._viewer = viewer;
        this._config = {
            fabricCanvasOptions: { selection: false, ...config.fabricCanvasOptions },
            enableAutoResize: config.enableAutoResize ?? true,
            enableMouseEvents: config.enableMouseEvents ?? true,
            constrainToImage: config.constrainToImage ?? false
        };
        this._id = `osd-canvas-${id}`;

        this._setupCanvas();
        this._fabricCanvas = new Canvas(this._canvas, this._config.fabricCanvasOptions);
        this._setupEventHandlers();
        this._initialResize();

        this._emit('canvas:ready');
    }

    private _setupCanvas(): void {
        this._canvasDiv = document.createElement('div');
        Object.assign(this._canvasDiv.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });
        this._viewer.canvas.appendChild(this._canvasDiv);

        this._canvas = document.createElement('canvas');
        this._canvas.id = this._id;
        this._canvas.style.pointerEvents = 'auto';
        this._canvasDiv.appendChild(this._canvas);
    }

    private _setupEventHandlers(): void {
        if (this._config.enableMouseEvents) {
            this._fabricCanvas.on('mouse:down', (e: TPointerEventInfo) => {
                if (e.target) {
                    e.e.preventDefault();
                    e.e.stopPropagation();
                }
            });

            this._fabricCanvas.on('mouse:up', (e: TPointerEventInfo) => {
                if (e.target) {
                    e.e.preventDefault();
                    e.e.stopPropagation();
                }
            });
        }

        if (this._config.constrainToImage) {
            this._setupConstraintHandlers();
        }

        if (this._config.enableAutoResize) {
            const updateHandler = () => {
                this._syncFabricWithViewport();
                this._resizeCanvas();
                if (this._config.constrainToImage) {
                    this._updateImageBounds();
                }
                this.render();
                this._emit('viewport:updated');
            };

            this._viewer.addHandler('update-viewport', updateHandler);
            this._viewer.addHandler('open', updateHandler);

            const resizeHandler = () => updateHandler();
            window.addEventListener('resize', resizeHandler);

            this._eventListeners.set('update-viewport', () =>
                this._viewer.removeHandler('update-viewport', updateHandler)
            );
            this._eventListeners.set('open', () =>
                this._viewer.removeHandler('open', updateHandler)
            );
            this._eventListeners.set('resize', () =>
                window.removeEventListener('resize', resizeHandler)
            );
        }
    }

    private _initialResize(): void {
        this._resizeCanvas();
        this._syncFabricWithViewport();
        if (this._config.constrainToImage) {
            this._updateImageBounds();
        }
    }

    private _updateImageBounds(): void {
        const tiledImage = this._viewer.world.getItemAt(0);
        if (!tiledImage) {
            setTimeout(() => this._updateImageBounds(), 100);
            return;
        }

        const imgSize = tiledImage.getContentSize();
        this._imageBounds = {
            left: 0,
            top: 0,
            width: imgSize.x,
            height: imgSize.y
        };
    }

    private _setupConstraintHandlers(): void {
        this._fabricCanvas.on('object:moving', this._constrainObject);
        this._fabricCanvas.on('object:scaling', this._constrainObject);
        this._fabricCanvas.on('object:rotating', this._constrainObject);
        this._fabricCanvas.on('object:added', this._constrainObject);
        this._fabricCanvas.on('object:modified', this._constrainObject);
        this._fabricCanvas.on('mouse:down', this._constrainMouseDown);
        this._fabricCanvas.on('mouse:move', this._constrainMouseMove);
    }

    private _removeConstraintHandlers(): void {
        this._fabricCanvas.off('object:moving', this._constrainObject);
        this._fabricCanvas.off('object:scaling', this._constrainObject);
        this._fabricCanvas.off('object:rotating', this._constrainObject);
        this._fabricCanvas.off('object:added', this._constrainObject);
        this._fabricCanvas.off('object:modified', this._constrainObject);
        this._fabricCanvas.off('mouse:down', this._constrainMouseDown);
        this._fabricCanvas.off('mouse:move', this._constrainMouseMove);
    }

    private readonly _constrainMouseDown = (e: any): void => {
        if (!this._config.constrainToImage || !this._imageBounds) return;
        const pointer = this._fabricCanvas.getScenePoint(e.e);
        const imgBounds = this._imageBounds;

        if (pointer.x < imgBounds.left || pointer.x > imgBounds.left + imgBounds.width ||
            pointer.y < imgBounds.top || pointer.y > imgBounds.top + imgBounds.height) {
            e.e.preventDefault();
            e.e.stopPropagation();
            this._fabricCanvas.selection = false;
        }
    };

    private readonly _constrainMouseMove = (e: any): void => {
        if (!this._config.constrainToImage || !this._imageBounds) return;

        const pointer = this._fabricCanvas.getScenePoint(e.e);
        const imgBounds = this._imageBounds;

        const constrained = {
            x: Math.max(imgBounds.left, Math.min(pointer.x, imgBounds.left + imgBounds.width)),
            y: Math.max(imgBounds.top, Math.min(pointer.y, imgBounds.top + imgBounds.height))
        };

        if (constrained.x !== pointer.x || constrained.y !== pointer.y) {
            e.pointer = constrained;
            if (this._fabricCanvas.isDrawingMode && this._fabricCanvas.freeDrawingBrush) {
                (this._fabricCanvas.freeDrawingBrush as any)._finalizeAndAddPath?.();
            }
        }
    };

    private readonly _constrainObject = (e: any): void => {
        if (!this._config.constrainToImage || !this._imageBounds) return;

        const obj = e.target || e.transform?.target;
        if (!obj) return;

        const bounds = obj.getBoundingRect(true);
        const imgBounds = this._imageBounds;

        let adjusted = false;

        if (bounds.left < imgBounds.left) {
            obj.left = obj.left! + (imgBounds.left - bounds.left);
            adjusted = true;
        }
        if (bounds.top < imgBounds.top) {
            obj.top = obj.top! + (imgBounds.top - bounds.top);
            adjusted = true;
        }
        if (bounds.left + bounds.width > imgBounds.left + imgBounds.width) {
            obj.left = obj.left! - (bounds.left + bounds.width - (imgBounds.left + imgBounds.width));
            adjusted = true;
        }
        if (bounds.top + bounds.height > imgBounds.top + imgBounds.height) {
            obj.top = obj.top! - (bounds.top + bounds.height - (imgBounds.top + imgBounds.height));
            adjusted = true;
        }

        if (adjusted) {
            obj.setCoords();
            this._fabricCanvas.requestRenderAll();
        }
    };
}

const validateDependencies = (): void => {
    if (!OpenSeadragon) {
        throw new Error('[openseadragon-fabric-overlay] OpenSeadragon is required');
    }
    if (!Canvas) {
        throw new Error('[openseadragon-fabric-overlay] FabricJS is required');
    }
};

export function createFabricOverlay(
    viewer: OpenSeadragon.Viewer,
    config: FabricOverlayConfig = {},
    id = 'default'
): FabricOverlay {
    validateDependencies();

    if (!viewer || typeof viewer.addHandler !== 'function') {
        throw new Error('Invalid OpenSeadragon viewer instance');
    }

    return new FabricOverlay(viewer, config, id);
}

export function initOSDFabricOverlay(
    viewer: OpenSeadragon.Viewer,
    options: { fabricCanvasOptions?: Partial<CanvasOptions> },
    id: string
): FabricOverlay {
    return createFabricOverlay(viewer, options, id);
}

export type { FabricOverlay };
