import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, Pane, CircleMarker, Tooltip } from 'react-leaflet';

import centroid from '@turf/centroid';
import flatten from '@turf/flatten';

class GeoJSONLabelsLayer extends Component {
  static propTypes = {
    useMultipleCentroids: PropTypes.bool,
    layerName: PropTypes.string.isRequired,
    bindFeatureToLabel: PropTypes.func.isRequired,
    minZoom: PropTypes.number,
    data: PropTypes.shape({
      features: PropTypes.array,
    }).isRequired,
  };
  static defaultProps = {
    minZoom: 0,
    useMultipleCentroids: false,
  };
  constructor(props, context) {
    super(props, context);
    this.tooltips = [];
  }

  shouldComponentUpdate() { return false; }

  addToTooltips(ref, scalerank) {
    this.tooltips.push({
      tooltipRef: ref,
      scalerank,
    });
  }

  checkZoom() {
    const { minZoom } = this.props;
    const { map } = this.context;
    const zoom = map.getZoom();
    if (zoom >= minZoom) {
      this.tooltips
        .filter(({ scalerank }) => scalerank > zoom)
        .forEach(this.hideTooltip);

      this.tooltips
        .filter(({ scalerank }) => scalerank <= zoom)
        .forEach(this.showTooltip);
    } else {
      this.tooltips.forEach(this.hideTooltip);
    }
  }

  showTooltip(tooltip) {
    if (tooltip.tooltipRef) {
      const { tooltipRef: { leafletElement } } = tooltip;
      const content = leafletElement._tooltip._container.firstChild;
      if (content.style.opacity !== 1 || !content.style.opacity) {
        content.style.opacity = 1;
      }
    }
  }

  hideTooltip(tooltip) {
    if (tooltip.tooltipRef) {
      const { tooltipRef: { leafletElement } } = tooltip;
      const content = leafletElement._tooltip._container.firstChild;
      if (content.style.opacity !== 0 || !content.style.opacity) {
        content.style.opacity = 0;
      }
    }
  }

  render() {
    const {
      data,
      layerName,
      bindFeatureToLabel,
      useMultipleCentroids,
    } = this.props;

    const { map } = this.context;
    map.on('zoomend', () => this.checkZoom());
    let i = 0;
    const len = data.features.length;
    const centroids = [];
    for (i; i < len; i += 1) {
      const feature = data.features[i];

      if (useMultipleCentroids && feature.geometry.type === 'MultiPolygon') {
        const polygons = flatten(feature);
        polygons.features.forEach(p => (
          centroids.push(
            { centroid: centroid(p), feature }
          )
        ));
      } else {
        centroids.push(
          { centroid: centroid(feature), feature }
        );
      }
    }
    const Tooltips = centroids.map(({ centroid: _centroid, feature }, j) => {
      const center = _centroid.geometry.coordinates;
      const label = feature.properties.name;
      const labelElement = bindFeatureToLabel(feature, label);
      return (
        <CircleMarker
          ref={(ref) => this.addToTooltips(ref, feature.properties.scalerank)}
          fill={false}
          stroke={false}
          key={`marker-${i}-${j}`}
          center={[center[1], center[0]]}
        >
          <Tooltip
            pane={`${layerName}-tooltip`}
            style={{ opacity: 1 }}
            direction={'center'}
            sticky={false}
            interactive={false}
            permanent
          >
            { labelElement }
          </Tooltip>
        </CircleMarker>
      );
    });
    return (
      <Pane name={`${layerName}-tooltip`} style={{ zIndex: 1200 }}>
        <LayerGroup onAdd={() => this.checkZoom()}>
          { Tooltips }
        </LayerGroup>
      </Pane>
    );
  }
}

GeoJSONLabelsLayer.contextTypes = {
  map: PropTypes.object,
};
export default GeoJSONLabelsLayer;
