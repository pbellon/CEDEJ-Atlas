import React, { Component } from 'react';
import { CanvasLayer } from 'utils/leaflet';
import * as d3 from 'd3';

import { TileLayer, GeoJSON, Circle, LayerGroup } from 'react-leaflet';


const getTemperatureStyle = (feature)=>{
  return {};
};

const getCircleStyle = (feature)=>{
  return {};
};

const LAYERS = [
  {
    // 'base'
    type: TileLayer,
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png',
  },
  {
    // 'naturalFeatures'
    type: TileLayer,
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png',
    attribution: '&copy; Powerded by <a href="http://www.esri.com/">ESRI</a> world reference overlay',
  },
  {
    // 'canvas'
    type: GeoJSON,
    dataKey: 'temperature',
    style: getTemperatureStyle,
  },
  {
    // 'canvas'
    type: LayerGroup,
    dataKey: 'circle',
    style: getCircleStyle,
    children: (data)=>{
      return data.features.map((circle,key)=>{
        const coords = circle.geometry.coordinates;
        const center = [ coords[1], coords[0]];
        const radius = 10000 + 5000 * parseInt(circle.properties.size_);
        console.log('circle radius', radius);
        console.log('circle center', center);
        return <Circle key={key} radius={ radius } center={ center } />
      });
    }
  },
];

export default LAYERS;
