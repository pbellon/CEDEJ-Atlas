import React from 'react';

import { WaterLabel, GeoJSONLabelsLayer } from 'components';

import './WaterLabelsLayer.css';

class WaterLabelsLayer extends GeoJSONLabelsLayer {
  static defaultProps = {
    ...GeoJSONLabelsLayer.defaultProps,
    layerName: 'water-labels',
    useMultipleCentroids: true,
    bindFeatureToLabel: (feature, label) => (
      <WaterLabel feature={feature}>{ label }</WaterLabel>
    ),
  };
}

export default WaterLabelsLayer;
