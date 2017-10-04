import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, Pane, CircleMarker, Tooltip } from 'react-leaflet';
import { Polygon } from 'leaflet';

import centroid from '@turf/centroid';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import flatten from '@turf/flatten';

class GeoJSONLabelsLayer extends Component {
  static propTypes = {
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
      leafletElement.openTooltip();
    }
  }

  hideTooltip(tooltip) {
    if (tooltip.tooltipRef) {
      const { tooltipRef: { leafletElement } } = tooltip;
      leafletElement.closeTooltip();
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
    let j = 0;
    const len = data.features.length;
    const Tooltips = [];
    for (i; i < len; i++) {
      const feature = data.features[i];
      const label = feature.properties.name;
      const labelElement = bindFeatureToLabel(feature, label);
      const centroids = [];
      
      if (useMultipleCentroids && feature.geometry.type === 'MultiPolygon') {
        const polygons = flatten(feature);
        polygons.features.forEach(p => (
          centroids.push(
            centroid(
              bboxPolygon(
                bbox(p)
              )
            )
          )
        ))
      } else {
        centroids.push(
          centroid(
            bboxPolygon(
              bbox(feature)
            )
          )
        );
      }
      
      centroids.forEach(_centroid => {
        const center = _centroid.geometry.coordinates;
        Tooltips.push((
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
              position={'center'}
              sticky={false}
              permanent
            >
              { labelElement } 
            </Tooltip>
          </CircleMarker>
        ));
      });
    }
    console.log('created tooltips', Tooltips);
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
