import L from 'leaflet';
import TileLoader from './mixin'; 
/*
 * Generic  Canvas Layer for leaflet 0.7 and 1.0-rc, 
 * copyright Stanislav Sumbera,  2016 , sumbera.com , license MIT
 * originally created and motivated by L.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288
 */


// -- support for both  0.0.7 and 1.0.0 rc2 leaflet
L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend({ 
	includes: [L.Mixin.Events, TileLoader],

	// -- initialized is called on prototype 
	initialize: function (delegate, pane, options) {
		this._map    = null;
    this._canvas = this._createCanvas();
    // backCanvas for zoom animation
    this._backCanvas = this._createCanvas();
		this._delegate = delegate;
		this.render = this.render.bind(this);
		L.setOptions(this, options);
		this.currentAnimationFrame = -1;
		this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				return window.setTimeout(callback, 1000 / 60);
			};
		this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
			window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { clearTimeout(id); };
	},

	delegate :function(del){
		this._delegate = del;
		return this;
	},
	
	_onLayerDidResize: function (resizeEvent) {
		this._canvas.width = resizeEvent.newSize.x;
		this._canvas.height = resizeEvent.newSize.y;
	},

	_onLayerDidMove: function () {
		var topLeft = this._map.containerPointToLayerPoint([0, 0]);
		L.DomUtil.setPosition(this._canvas, topLeft);
		this.draw();
	},

	getEvents: function () {
		return {
			viewreset: this._reset,
			resize: this._reset,
			move: this.redraw,
			zoomanim: this._animateZoom,
			zoomend: this._endZoomAnim,
		};
	},

	_createCanvas: function(){
		const canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.pointerEvents = "none";
		// canvas.style.zIndex = this.options.zIndex || 0;
		var className = 'leaflet-tile-container leaflet-zoom-animated';
		canvas.setAttribute('class', className);
		canvas.setAttribute('moz-opaque', true);
		return canvas;
	},



	_reset: function(){
		var size = this._map.getSize();
		this._canvas.width = size.x;
		this._canvas.height = size.y;

		// fix position
		var pos = L.DomUtil.getPosition(this._map.getPanes().mapPane);
		console.log('pos', pos);
		if (pos) {
			L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
		}
		// this.onResize();
		this._render();
	},
	_render: function(){
		if (this.currentAnimationFrame >= 0) {
			this.cancelAnimationFrame.call(window, this.currentAnimationFrame);
		}
		this.currentAnimationFrame = this.requestAnimationFrame.call(window, this.render);
	},

	onAdd: function (map) {
		this._map = map;

		// add container with the canvas to the tile pane
		// the container is moved in the oposite direction of the 
		// map pane to keep the canvas always in (0, 0)
		var tilePane = this._map._panes.tilePane;
		var _container = L.DomUtil.create('div', 'leaflet-layer');
		_container.style.zIndex = this.options.zIndex || 0;
		_container.appendChild(this._canvas);
		_container.appendChild(this._backCanvas);
		this._backCanvas.style.display = 'none';
		tilePane.appendChild(_container);

		this._container = _container;

		// hack: listen to predrag event launched by dragging to
		// set container in position (0, 0) in screen coordinates

		if (map.dragging.enabled()) {
			map.dragging._draggable.on('predrag', function() {
				var d = map.dragging._draggable;
				L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
			}, this);
		}
		map.on(this.getEvents(), this);
		if(this.options.tileLoader) {
			this._initTileLoader();
		}	
		this._reset();
	},

	onRemove: function (map) {
		var del = this._delegate || this;
		del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback
		this._container.parentNode.removeChild(this._container);
		map.off(this.getEvents(),this);
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	LatLonToMercator: function (latlon) {
		return {
			x: latlon.lng * 6378137 * Math.PI / 180,
			y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
		};
	},

	_getMapBounds: function() {
		var latLongBounds = this._map.getBounds();
		var ne = this._map.latLngToLayerPoint(latLongBounds.getNorthEast());
		var sw = this._map.latLngToLayerPoint(latLongBounds.getSouthWest());

		return {
			width: ne.x - sw.x,
			height: sw.y - ne.y,
			left: sw.x,
			top: ne.y
		};
	},

	redraw: function(direct) {
		var domPosition = L.DomUtil.getPosition(this._map.getPanes().mapPane);
		console.log('redraw - domPos', domPosition);
		if (domPosition) {
			L.DomUtil.setPosition(this._canvas, { x: -domPosition.x, y: -domPosition.y });
		}
		if (direct) {
			this.render();
		} else {
			this._render();
		}
	},

	draw: function () {
		return this._reset();
	},

	_animateZoom: function (e) {
		if (!this._animating) {
			this._animating = true;
		}
		var back = this._backCanvas;

		back.width = this._canvas.width;
		back.height = this._canvas.height;

		// paint current canvas in back canvas with trasnformation
		var pos = this._canvas._leaflet_pos || { x: 0, y: 0 };
		back.getContext('2d').drawImage(this._canvas, 0, 0);

		// hide original
		this._canvas.style.display = 'none';
		back.style.display = 'block';
		const scale = this._map.getZoomScale(e.zoom);
		var newCenter = this._map._latLngToNewLayerPoint(this._map.getCenter(), e.zoom, e.center);
		var oldCenter = this._map._latLngToNewLayerPoint(e.center, e.zoom, e.center);

		var diff = {
			x:  newCenter.x - oldCenter.x,
			y:  newCenter.y - oldCenter.y
		};

		L.DomUtil.setTransform(back, diff, scale);
		console.log('animation done !');
	},

	_endZoomAnim: function(){
		this._animate = false;
		this._canvas.style.display = 'block';
		this._backCanvas.style.display = 'none';
	},

	render: function(){
		console.log('render!');
		const size   = this._map.getSize();
		const bounds = this._getMapBounds();
		const zoom   = this._map.getZoom();

		const center = this.LatLonToMercator(this._map.getCenter());
		const corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

		const del = this._delegate || this;
		del.onDrawLayer && del.onDrawLayer( {
			layer : this,
			canvas: this._canvas,
			bounds: bounds,
			size: size,
			zoom: zoom,
			center : center,
			corner : corner
		});
	},
});

const initLayer = (delegate, pane, options)=>{ return new L.CanvasLayer(delegate, pane, options); }

export default initLayer;
