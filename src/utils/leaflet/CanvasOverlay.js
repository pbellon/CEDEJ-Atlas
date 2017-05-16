/*
Original: https://github.com/danwild/leafletjs-canvas-overlay/
Generic  Canvas Overlay for leaflet,
Stanislav Sumbera, April , 2014

- added userDrawFunc that is called when Canvas need to be redrawn
- added few useful params fro userDrawFunc callback
- fixed resize map bug
inspired & portions taken from  :   https://github.com/Leaflet/Leaflet.heat

License: MIT

*/
import L from 'leaflet';

L.CanvasOverlay = L.Class.extend({

  initialize: (userDrawFunc, options) => {
    this.userDrawFunc = userDrawFunc;
    L.setOptions(this, options);
  },

  drawing: (userDrawFunc) => {
    this.userDrawFunc = userDrawFunc;
    return this;
  },

  params: (options) => {
    L.setOptions(this, options);
    return this;
  },

  canvas: () => {
    return this._canvas;
  },

  redraw: () => {
    if (!this._frame) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd: (map) => {
    this._map = map;
    this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

    const size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;

    const animated = this._map.options.zoomAnimation && L.Browser.any3d;
    const animatedClass = (animated ? 'animated' : 'hide');
    L.DomUtil.addClass(this._canvas, `leaflet-zoom-${animatedClass}`);


    map._panes.overlayPane.appendChild(this._canvas);

    map.on('moveend', this._reset, this);
    map.on('resize', this._resize, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove: (map) => {
    map.getPanes().overlayPane.removeChild(this._canvas);

    map.off('moveend', this._reset, this);
    map.off('resize', this._resize, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }

    this._canvas = null;
  },

  addTo: (map) => {
    map.addLayer(this);
    return this;
  },

  _resize: (resizeEvent) => {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;
  },

  _reset: () => {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    this._redraw();
  },

  _redraw: () => {
    const size = this._map.getSize();
    const bounds = this._map.getBounds();
    const zoomScale = (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
    const zoom = this._map.getZoom();
    if (this.userDrawFunc) {
      const props = {
        canvas: this._canvas,
        options: this.options,
        bounds,
        size,
        zoomScale,
        zoom,
      };
      this.userDrawFunc(this, props);
    }
    this._frame = null;
  },

  _animateZoom: (e) => {
    const scale = this._map.getZoomScale(e.zoom);
    const offset = this._map._getCenterOffset(e.center)
      ._multiplyBy(-scale)
      .subtract(this._map._getMapPanePos());

    const translate = L.DomUtil.getTranslateString(offset);

    this._canvas.style[L.DomUtil.TRANSFORM] = `${translate} scale(${scale})`;
  },

});

const canvasLayer = (userDrawFunc, options) => {
  return new L.CanvasOverlay(userDrawFunc, options);
};

L.canvasOverlay = canvasLayer;

export { canvasLayer };
