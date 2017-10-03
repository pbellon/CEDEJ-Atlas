import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, Pane, CircleMarker, Tooltip } from 'react-leaflet';
import { Polygon } from 'leaflet';

import { DesertName } from 'components';

import './DesertsLayer.css';

class DesertsLayer extends Component {
  static propTypes = {
    minZoom: PropTypes.number,
    data: PropTypes.shape({
      features: PropTypes.array,
    }),
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
        .filter(({ scalerank }) => scalerank >= zoom)
        .forEach(this.hideTooltip);

      this.tooltips
        .filter(({ scalerank }) => scalerank < zoom)
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
    const { data } = this.props;
    const { map } = this.context;
    map.on('zoomend', () => this.checkZoom());
    const Tooltips = data.features.map((feature, key) => {
      const polygon = new Polygon(feature.geometry.coordinates).addTo(map);
      const center = polygon.getBounds().getCenter();
      const label = feature.properties.name;
      map.removeLayer(polygon);
      return (
        <CircleMarker
          ref={(ref) => this.addToTooltips(ref, feature.properties.scalerank)}
          fill={false}
          stroke={false}
          key={`marker-${key}`}
          center={[center.lng, center.lat]}
        >
          <Tooltip pane={'desert-tooltip'} style={{ opacity: 1 }} permanent>
            <DesertName desert={feature}>{ label }</DesertName>
          </Tooltip>
        </CircleMarker>
      );
    });
    return (
      <Pane name={'desert-tooltip'} style={{ zIndex: 1200 }}>
        <LayerGroup onAdd={() => this.checkZoom()}>
          { Tooltips }
        </LayerGroup>
      </Pane>
    );
  }
}

DesertsLayer.contextTypes = {
  map: PropTypes.object,
};
export default DesertsLayer;
