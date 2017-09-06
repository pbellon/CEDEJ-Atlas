import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, Pane, CircleMarker, Tooltip } from 'react-leaflet'; 
import { Polygon } from 'leaflet';

import { DesertName } from 'components';

import './DesertsLayer.css';

const DesertsLayer = ({ data, minZoom }, {map})=>{
  const Layers = [];
  const addToLayers = (ref, scalerank)=>{
    Layers.push({
      layer: ref,
      scalerank: scalerank
    });
  };
  const showLayer = ({ layer: { leafletElement }})=>{
    leafletElement.openTooltip();
  };

  const hideLayer = ({ layer: { leafletElement }})=>{
    leafletElement.closeTooltip();
  };
  const checkZoom = ()=>{
    const zoom = map.getZoom();
    if(zoom >= minZoom){
      Layers.filter(({scalerank})=>scalerank>=zoom).forEach(hideLayer);
      Layers.filter(({scalerank})=>scalerank<zoom).forEach(showLayer);
    } else {
      Layers.forEach(hideLayer);
    }
  };
  map.on('zoomend', checkZoom); 
  const Tooltips = data.features.map((feature, key) => {
    const polygon = new Polygon(feature.geometry.coordinates).addTo(map);
    const center = polygon.getBounds().getCenter();
    const label = feature.properties.name;
    map.removeLayer(polygon);
    return (
      <CircleMarker
        ref={(ref)=>addToLayers(ref, feature.properties.scalerank)}
        radius={1}
        fill={false}
        stroke={false}
        key={key}
        center={ [center.lng, center.lat ] }>
        <Tooltip pane={'desert-tooltip'} style={{opacity: 1}}>
          <DesertName desert={ feature }>{ label }</DesertName>
        </Tooltip>
      </CircleMarker>
    );
  });
  checkZoom();
  return (
    <Pane name={'desert-tooltip'} style={{zIndex: 1200}}>
      <LayerGroup>
        { Tooltips }
      </LayerGroup>
    </Pane>
  );
};

DesertsLayer.contextTypes = {
  map: PropTypes.object,
};
export default DesertsLayer;
