import leafletImage from 'leaflet-image';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
// import { CanvasLayer } from 'utils/leaflet';
// import styled from 'styled-components';
import { world } from 'data';
import * as d3 from 'd3';

import 'leaflet/dist/leaflet.css';
import './Atlas.css';

import LAYERS from './Layers';

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
    this.layers = LAYERS;
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
    if (this.props.onRender) {
      this.map = this.map || mapRef.leafletElement;
      leafletImage(this.map, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        const url = canvas.toDataURL();
        console.log('bindContainer url', url);
        this.props.onRender(url);
      });
    }
  }


  render() {
    const position = [22, 35];
    const { base, naturalFeatures } = this.layers;

    return (
      <Map
        center={position} zoom={5}
        ref={(ref) => this.bindContainer(ref)}
      >
        <TileLayer {...base} />
        <TileLayer {...naturalFeatures} />
      </Map>
    );
  }
}
