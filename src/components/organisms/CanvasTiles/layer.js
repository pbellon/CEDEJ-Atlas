import {
  DomUtil,
  GridLayer,
  Point,
  LatLng,
  LatLngBounds,
  setOptions
} from 'leaflet'; 

export const CanvasTiles = GridLayer.extend({
  isCanvasLayer: function(){ return true },
  updateData: function(data){
    if(this._drawDelegate){
      this._drawDelegate.updateData(data);
    }
  },
  updateOpacity(opacity){
    this._container.style.opacity = opacity;
  },
  initialize: function (drawDelegate, onRendered, options) {
    this._drawDelegate = drawDelegate;

    this._drawDelegate.setLayer(this);
    this._onRendered = onRendered;
    setOptions(this, options);
    /*
    var self = this;
    this.drawTile = function (tileCanvas, tilePoint, zoom) {

      this._draw(tileCanvas, tilePoint, zoom);
      if (self.options.debug) {
        self._drawDebugInfo(tileCanvas, tilePoint, zoom);
      }

    };
    */
    return this;
  },

  drawing: function (drawDelegate) {
    this._drawDelegate = drawDelegate;
    return this;
  },

  params: function (options) {
    setOptions(this, options);
    return this;
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  _drawDebugInfo: function (tileCanvas, tilePoint, zoom) {

    var max = this.options.tileSize;
    var g = tileCanvas.getContext('2d');
    g.globalCompositeOperation = 'destination-over';
    g.strokeStyle = '#FFFFFF';
    g.fillStyle = '#FFFFFF';
    g.strokeRect(0, 0, max, max);
    g.font = "12px Arial";
    g.fillRect(0, 0, 5, 5);
    g.fillRect(0, max - 5, 5, 5);
    g.fillRect(max - 5, 0, 5, 5);
    g.fillRect(max - 5, max - 5, 5, 5);
    g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
    g.strokeText(tilePoint.x + ' ' + tilePoint.y + ' ' + zoom, max / 2 - 30, max / 2 - 10);

  },

  tilePoint: function (map, coords,tilePoint, tileSize) {
    // start coords to tile 'space'
    var s = tilePoint.multiplyBy(tileSize);

    // actual coords to tile 'space'
    var p = map.project(new LatLng(coords[0], coords[1]));

    // point to draw
    var x = Math.round(p.x - s.x);
    var y = Math.round(p.y - s.y);
    return {x: x,
      y: y};
  },
   /**
    * Creates a query for the quadtree from bounds
    */
  _boundsToQuery: function (bounds) {
    if (bounds.getSouthWest() == undefined) { return { x: 0, y: 0, width: 0.1, height: 0.1 }; }  // for empty data sets
    return {
      x: bounds.getSouthWest().lng,
      y: bounds.getSouthWest().lat,
      width: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
      height: bounds.getNorthEast().lat - bounds.getSouthWest().lat
    };
  },
  createTile: function(coords){
    const tile = DomUtil.create('canvas', 'leaflet-tile');
    const size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;
    if(this._drawDelegate){
      this._drawDelegate.draw({
        canvas: tile,
        layer: this,
        size,
        coords,
      });
    }
    return tile;
  },
  _draw: function (tileCanvas, tilePoint, zoom) {

    var tileSize = this.options.tileSize;

    var nwPoint = tilePoint.multiplyBy(tileSize);
    var sePoint = nwPoint.add(new Point(tileSize, tileSize));


    // padding to draw points that overlap with this tile but their center is in other tile
    var pad = new Point(this.options.padding, this.options.padding);

    nwPoint = nwPoint.subtract(pad);
    sePoint = sePoint.add(pad);

    var bounds = new LatLngBounds(this._map.unproject(sePoint), this._map.unproject(nwPoint));
    var zoomScale  = 1 / ((40075016.68 / tileSize) / Math.pow(2, zoom));
    // console.time('process');

    if (this._drawDelegate) {
      this._drawDelegate.draw({
        layer: this,
        canvas: tileCanvas,
        tilePoint: tilePoint,
        bounds: bounds,
        size: tileSize,
        zoomScale: zoomScale,
        zoom: zoom,
        options: this.options,
      });
    }
    this._onRendered && this._onRendered();

    // console.timeEnd('process');


  },


});

export const canvasTiles = function (drawDelegate, onRendered, options) {
  return new CanvasTiles(drawDelegate, onRendered, options);
};


