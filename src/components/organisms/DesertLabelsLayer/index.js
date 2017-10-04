import React, { Component } from 'react';

import { DesertName, GeoJSONLabelsLayer } from 'components';

import './DesertLabelsLayer.css';

class DesertLabelsLayer extends GeoJSONLabelsLayer {
  static defaultProps = {
    ...GeoJSONLabelsLayer.defaultProps,
    layerName: 'desert',
    bindFeatureToLabel: (feature, label) => (
      <DesertName desert={feature}>{ label }</DesertName> 
    ),
  };
}

export default DesertLabelsLayer;
