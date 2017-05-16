import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import { CanvasLayer } from 'utils/leaflet';
import leafletImage from 'leaflet-image';

import { world } from 'data';

import * as d3 from 'd3';

export default class Atlas extends Component {
  static propTypes = {
    print: PropTypes.bool,
    onRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultPropTypes = {
    print: false,
  }

  constructor() {
    super();
    this.projection = d3.geoMercator().scale(110).center([55.0, 20.00]);
  }

  layers = {
    base: {
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
      maxZoom: 17,
    },
    naturalFeatures: {
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png',
      maxZoom: 17,
    },
  }

  drawCanvas({ canvas }) {
    const ctx = canvas.getContext('2d');
    const path = d3.geoPath(this.projection.proj).context(ctx);
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    path(world);
    ctx.stroke();
  }

  bindContainer(mapRef) {
    if (!this.props.onRender) { return; }
    const map = mapRef.props.leafletElement;
    console.log('map', mapRef, map);
    leafletImage(this.map, (err, canvas) => {
      if (err) {
        console.error(err);
        return;
      }
      this.props.onRender(canvas.toDataURL());
    });
  }


  render() {
    const position = [0, 0];
    const { base, naturalFeatures } = this.layers;
    const { width, height } = this.props;
    return (
      <Map
        center={position}
        zoom={13}
        ref={(ref) => this.bindContainer(ref)}
        width={width}
        height={height}
      >
        <TileLayer {...base} />
        <TileLayer {...naturalFeatures} />
      </Map>
    );
  }
}
