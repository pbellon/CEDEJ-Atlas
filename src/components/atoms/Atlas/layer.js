import React from 'react';

import PropTypes from 'prop-types';
import { LatLng, Layer, Mixin, DomUtil, setOptions } from 'leaflet';
import { MapLayer } from 'react-leaflet';

import TileLoader from './mixin'; 

/*
 * Generic  Canvas Layer for leaflet 0.7 and 1.0-rc, 
 * copyright Stanislav Sumbera,  2016 , sumbera.com , license MIT
 * originally created and motivated by L.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288
 */
const range = (start, end)=>{
  return [...Array(1+end-start).keys()].map(v => start+v)
}

// -- support for both  0.0.7 and 1.0.0 rc2 leaflet
const __CanvasLayer = Layer.extend({ 
  includes: [Mixin.Events, TileLoader],
  updateData: function(data){
    this._delegate.updateData(data);
    this._rerender();
  },
  updateOpacity: function(opacity){
    if(!this._container){ return; }
    Object.keys(this._renderedCanvas).forEach((zoom)=>{
      this._renderedCanvas[zoom].shouldRender = true;
    });
    this._container.style.opacity = opacity;
  },

  // -- initialized is called on prototype 
  initialize: function(delegate, options){
    this._map    = null;
    this._renderedCanvas = {};
    // backCanvas for zoom animation
    this._delegate = delegate;
    this.render = this.render.bind(this);
    this._setBBox(options.bbox);
    setOptions(this, options);
    this.currentAnimationFrame = -1;
    this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function(id) { clearTimeout(id); };
  },
  
  delegate: function(del){
    this._delegate = del;
    return this;
  },
  _setBBox: function(bbox){
    this._bbox = {
      min: {x:bbox[0], y:bbox[1]},
      max: {x:bbox[2], y:bbox[3]}
    };
  },
  _getCenter: function(){
    return this._map.getCenter();
  },
  _getZoom: function(){
    return this._map.getZoom();
  },
  _getBBoxAt: function(zoomLevel){
    const zoom = zoomLevel || this._map.getZoom();
    const { min, max } = this._bbox;
    const _min = this._map.project(new LatLng(max.y, min.x), zoom);
    const _max = this._map.project(new LatLng(min.y, max.x), zoom);
    const latLngCenter = this._map.getCenter();
    const center = this._map.project(latLngCenter, zoom);
    const bounds = this._map.getPixelBounds(latLngCenter,zoomLevel); 
    const pixelOrigin = this._map._getNewPixelOrigin(latLngCenter, zoom);    
    return {
      origin: pixelOrigin,
      center,
      width: _max.x - _min.x,
      height: _max.y - _min.y,
      min:_min, 
      max:_max,
      bounds,
    };
  },
  _onLayerDidResize: function(resizeEvent){
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;
  },

  _onLayerDidMove: function(){
    var domPosition = DomUtil.getPosition(this._map.getPanes().mapPane);
    if (domPosition) {
     // L.DomUtil.setPosition(this._canvas, { x: -domPosition.x, y: -domPosition.y });
    }

  },

  getEvents: function(){
    return {
      viewreset: this._reset,
      resize: this._reset,
      move: this._onLayerDidMove,
      zoomanim: this._animateZoom,
      zoomend: this._endZoomAnim,
    };
  },

  _createCanvas: function({id,width, height, bounds:{min:{x,y}}}){
    // console.log(`createCanvas zoom ${id} - x,y`,x,y);
    const px = (s)=>`${s}px`;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.left =  0;
    canvas.style.top = 0;
    canvas.style.position = 'absolute';
    canvas.style.width = px(width);
    canvas.style.height = px(height);
    // canvas.style.pointerEvents = "none";
    // canvas.style.zIndex = this.options.zIndex || 0;
    var className = 'leaflet-tile-container leaflet-zoom-animated';
    canvas.style.display = 'none';
    canvas.setAttribute('class', className);
    canvas.setAttribute('id', id);
    DomUtil.setPosition(canvas, { x:-x, y:-y });
    // canvas.setAttribute('moz-opaque', true);
    return canvas;
  },
  
  _getCanvasAt(zoom){
    console.log(this._renderedCanvas);
    return this._renderedCanvas[zoom || this._map.getZoom()];
  },

  _setActiveCanvas: function(rendered){
    if(this._canvas){
      this._canvas.style.display = 'none';
    }
    this._canvas = rendered.canvas;
    this._canvas.style.display = 'block';
  },
  
  _prerenderAtZoom: function(zoomLevel){
    return new Promise((resolve, reject)=>{
      const mapPos = this._map._getMapPanePos();
      const {min, max, width, height, bounds, center, origin} = this._getBBoxAt(zoomLevel);
      // console.log('pixel origin:', origin);
      const canvas = (this._getCanvasAt(zoomLevel)||{}).canvas || this._createCanvas({
        id: `canvas-zoom-${zoomLevel}`,
        width, height, bounds
      });
      const shouldRender = false;
      const del = this._delegate;
      del.render && del.render({
        canvas, layer:this,
        zoom:zoomLevel,
        // bounds
      }).then((canvas)=>{
        resolve({
          zoomLevel,
          canvas,
          min,
          max,
          width,
          height,
          bounds,
          center,
          origin,
          shouldRender
        });
      });
    });
  },

  _prerender: function(zoomLevels){

    const rendering = zoomLevels.map((zoom)=>this._prerenderAtZoom(zoom));
    
    return Promise.all(rendering).then(
      (renderedCanvas)=>{
        console.log('rendered:', renderedCanvas);
        renderedCanvas.forEach((canvas)=>{
          if(!canvas.canvas.parentElement){
            this._container.append(canvas.canvas);
          };
          this._renderedCanvas[canvas.zoomLevel] = canvas;
        });
      }
    );
  },
  _rerender: function(){
    return new Promise((resolve, reject)=>{
      const zoom = this._getZoom();
      const minZoom = this._map.getMinZoom();
      const maxZoom = this._map.getMaxZoom();
      this._prerenderAtZoom(this._getZoom())
        .then((canvas)=>{
          this._setActiveCanvas(canvas);
          this._updateCanvasPosition();
        })
        .then(()=>this._prerender([
            zoom - 1 < minZoom ? minZoom : zoom-1,
            zoom + 1 > maxZoom ? maxZoom : zoom+1
          ]));
    });
  },
  // check if previous or next zoom level should be rendered
  _checkSiblingsRendering: function(){
      const zoom = this._getZoom();
      const minZoom = this._map.getMinZoom();
      const maxZoom = this._map.getMaxZoom();

      const next = this._getCanvasAt(zoom+1>maxZoom?maxZoom:zoom+1);
      const prev = this._getCanvasAt(zoom-1<minZoom?minZoom:zoom-1);
      const renderLevels = [];
      if(next.shouldRender){
        renderLevels.push(next.zoomLevel);
      }
      if(prev.shouldRender){
        renderLevels.push(prev.zoomLevel);
      }
      renderLevels.length > 0 && this._prerender(renderLevels);
  },
  _reset: function(){
    // var size = this._map.getSize();
    // this._canvas.width = size.x;
    // this._canvas.height = size.y;

    // fix position
    var pos = DomUtil.getPosition(this._map.getPanes().mapPane);
    if (pos) {
      // L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
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

  onAdd: function(map) {
    this._map = map;

    // add container with the canvas to the tile pane
    // the container is moved in the oposite direction of the 
    // map pane to keep the canvas always in (0, 0)
    var tilePane = this._map._panes.tilePane;
    var _container = DomUtil.create('div', 'leaflet-layer');
    _container.style.zIndex = this.options.zIndex || 0;
    _container.style.opacity = this.options.opacity || 1;
    _container.append(this._canvas);
    tilePane.appendChild(_container);
    this._container = _container;
    
    const minZoom = this._map.getMinZoom();
    const maxZoom = this._map.getMaxZoom();
    const zoom = this._getZoom();
    const zoomLevels = range(minZoom, maxZoom).filter(z=>z!=zoom);

    this._prerender(
      [zoom]
    ).then(()=>{
      this._setActiveCanvas(this._getCanvasAt());
    }).then(()=>{
      this._prerender(zoomLevels)  
    });
    // hack: listen to predrag event launched by dragging to
    // set container in position (0, 0) in screen coordinates

    map.on(this.getEvents(), this);
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
  redraw: function(direct) {
  },

  draw: function() {
    // return this._reset();
  },
  _updateCanvasPosition: function(canvas, center, zoom){
    center = center || this._getCenter();
    zoom = zoom || this._getZoom();
    canvas = canvas || this._canvas;
    
    const pixelOrigin = this._map._getNewPixelOrigin(center, zoom);
    // const {x,y} = this._map._latLngToNewLayerPoint(this._map.getCenter(), e.zoom);
    // we just need to adjust to the new map's origin (in pixels)
    DomUtil.setPosition(canvas, {x:-pixelOrigin.x, y:-pixelOrigin.y});

  },
  _animateZoom: function(e) {
    if (!this._animating) {
      this._animating = true;
    }
    // const { min } = this._getBBoxAt(e.zoom);
    const prerendered = this._getCanvasAt(e.zoom);
    console.log('canvas for', e.zoom, prerendered);
    const { canvas, center, origin } = prerendered;
    this._setActiveCanvas(prerendered);
    this._updateCanvasPosition(prerendered.canvas, e.center, e.zoom);
    // const newCenter = this._map._latLngToNewLayerPoint(this._map.getCenter(), e.zoom, e.center);
  },

  _endZoomAnim: function(e){
    this._animate = false;
    // console.log('zoomend - pixelOrigin', this._map.getPixelOrigin());
    // const mapPos = DomUtil.getPosition(this._map.getPanes().mapPane);
    // DomUtil.setPosition(this._canvas, { x:-mapPos.x, y:-mapPos.y});
    // this._canvas.style.display = 'block';
    this._checkSiblingsRendering();
  },

  render: function(){}
});

const canvasLayer = (delegate, options)=>{
  return new __CanvasLayer(delegate, options);
}

export default class CanvasLayer extends MapLayer {
  static propTypes = {
    delegate: PropTypes.func,
    zIndex: PropTypes.number,
    bbox: PropTypes.array,
  }

  createLeafletElement(props){
    const { delegate, data, ...options }= this.getOptions(props);

    var _del = new delegate(data);
    return canvasLayer(_del, options);
  }

  updateLeafletElement(
    {opacitiy:fromOpacity, data:{temperatures:fromTemps, aridity:fromAridity}},
    {opacity: toOpacity,   data:{temperatures:toTemps,   aridity:toAridity}}
  ){
    const diffAridity = fromAridity.length != toAridity.length;
    const diffTemps = fromTemps.length != toTemps.length;
    if(diffTemps || diffAridity){
      this.leafletElement.updateData({
        aridity:toAridity,
        temperatures: toTemps
      });
    }
    if(fromOpacity != toOpacity){
      this.leafletElement.updateOpacity(toOpacity);
    }
  }
}
