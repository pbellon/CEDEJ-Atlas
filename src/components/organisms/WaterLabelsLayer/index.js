import React from 'react';
import { translate } from 'react-i18next';

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
  };

  bindFeatureToLabel(feature, label){
    const { t } = this.props;
    return (<WaterLabel feature={feature}>{ t(label) }</WaterLabel>);
  } 
}

export default translate('waterLabels', { wait: true })(WaterLabelsLayer);
