import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, Pane, CircleMarker, Tooltip } from 'react-leaflet'; 
import { Polygon } from 'leaflet'; 
import './DesertsLayer.css';

const DesertsLayer = ({ data }, {map})=>{
  const Tooltips = data.features.map((feature, key) => {
    const polygon = new Polygon(feature.geometry.coordinates).addTo(map);
    const center = polygon.getBounds().getCenter();
    const label = feature.properties.name;
    map.removeLayer(polygon);
    return (
      <CircleMarker
        radius={1}
        fill={false}
        stroke={false}
        key={key}
        center={ [center.lng, center.lat ] }>
        <Tooltip permanent pane={'desert-tooltip'} style={{opacity: 1}}>
          <span>{ label }</span>
        </Tooltip>
      </CircleMarker>
    );
  });

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
