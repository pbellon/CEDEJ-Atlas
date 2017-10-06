import React from 'react';

import { WaterLabel, GeoJSONLabelsLayer } from 'components';

import './WaterLabelsLayer.css';

const featurePositioning = ({ properties: { featurecla } }) => {
  switch(featurecla) {
    case 'ocean': return GeoJSONLabelsLayer.positioning.bbox;
    default: return GeoJSONLabelsLayer.positioning.centroid;
  }
};

class WaterLabelsLayer extends GeoJSONLabelsLayer {
  static defaultProps = {
    ...GeoJSONLabelsLayer.defaultProps,
    layerName: 'water-labels',
    useMultipleCentroids: true,
    positioning: featurePositioning,
    bindFeatureToLabel: (feature, label) => (
      <WaterLabel feature={feature}>{ label }</WaterLabel>
    ),
  };
}

export default WaterLabelsLayer;
