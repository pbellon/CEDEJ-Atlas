import React, { Component } from 'react';
import { CanvasLayer } from 'utils/leaflet';
import * as d3 from 'd3';

import { TileLayer, GeoJSON, Circle, LayerGroup } from 'react-leaflet';


const circle_colors = {
  A: '#468fba',
  B: '#498b45',
  C: '#e15e46',
  D: '#fea959',
  E: '#7e6ba3',
  F: '#858288',
};

const area_colors = {
  1: '#b76648',
  2: '#e07a54',
  3: '#bf7534',
  4: '#e68839',
  5: '#edad78',
  6: '#c19931',
  7: '#e3b131',
  8: '#e8c66b',
  9: '#95a053',
  10: '#abb85c',
  11: '#c4cd8d',
};

const getTemperatureStyle = ({properties})=>{
  const color = area_colors[properties.Temperatur];
  // console.log('getTemperatureStyle', color);
  return {
    color: color,
    fill: color,
    fillOpacity: 0.9,
    stroke: false,
  };
};

const getCircleStyle = ({properties})=>{
  let color = circle_colors[properties.colours];
  color = 'red';
  return {
    stroke: false,
    color: color,
    fillColor: color,
    // fillOpacity: 0.9,
  };
};

const LAYERS = [
  {
    // 'base'
    type: TileLayer,
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png',
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
    style: ()=>{ debugger; },
    children: (data)=>{
      return data.features.map((circle,key)=>{
        const coords = circle.geometry.coordinates;
        const center = [ coords[1], coords[0]];
        const radius = 10000 + 5000 * parseInt(circle.properties.size_);
        const circleElem = (
          <Circle
            key={key}
            radius={radius}
            interactive={false}
            center={center}
            style={getCircleStyle(circle)} />
        );
        return circleElem;
      });
    }
  },
  {
    // 'naturalFeatures'
    type: TileLayer,
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png',
    attribution: '&copy; Powerded by <a href="http://www.esri.com/">ESRI</a> world reference overlay',
  },
];

export default LAYERS;
