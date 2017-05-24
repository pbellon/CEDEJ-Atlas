import leafletImage from 'leaflet-image';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'react-leaflet';
import { CanvasLayer } from 'utils/leaflet';
import L from 'leaflet';
// import styled from 'styled-components';

import 'leaflet/dist/leaflet.css';
import './Atlas.css';

import LAYERS from './Layers';

const canvas = L.canvas();

export default class Atlas extends Component {
  static propTypes = {
    data: PropTypes.object,
    print: PropTypes.bool,
    onRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultPropTypes = {
    print: false,
  }

  layers = LAYERS

  bindContainer(mapRef) {
    if (this.props.onRender) {
      this.map = this.map || mapRef.leafletElement;
      // TODO: replace by dispatch or props callback
      leafletImage(this.map, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        const url = canvas.toDataURL();
        this.props.onRender(url);
      });
    }
  }


  render() {
    const { data } = this.props;
    const position = [10, 35];
    return (
      <Map
        renderer={canvas}
        center={position} zoom={4}
        ref={(ref) => this.bindContainer(ref)}
      >
        { this.layers.map((layer, key)=>{
          const { type, dataKey, children, ...opts} = layer;
          const _data = dataKey ? data[dataKey] : null;
          const _children = children ? children(_data) : null;
          return React.createElement(type, {key, data:_data, ...opts}, _children);
        })}
      </Map>
    );
  }
}
