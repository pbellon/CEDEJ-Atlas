import React from 'react';
import { translate } from 'react-i18next';
import { DesertName, GeoJSONLabelsLayer } from 'components';

import { key } from 'utils/locales';
import './DesertLabelsLayer.css';

class DesertLabelsLayer extends GeoJSONLabelsLayer {
  static defaultProps = {
    ...GeoJSONLabelsLayer.defaultProps,
    layerName: 'desert',
  };

  bindFeatureToLabel(feature, label){
    const { t } = this.props;
    return (<DesertName desert={feature}>{ t(key(label)) }</DesertName>);
  }
}

export default translate('desertLabels', { wait: true })(DesertLabelsLayer);
