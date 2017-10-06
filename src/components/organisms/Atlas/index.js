import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  TileLayer,
  ScaleControl,
  ZoomControl,
} from 'react-leaflet';
import {
  canvas,
  LatLngBounds,
  LatLng,
} from 'leaflet';

import {
  CedejWatermark,
  CirclesLayer,
  ContextualInfoPopup,
  DesertLabelsLayer,
  WaterLabelsLayer,
  AridityTemperaturesLayer,
  WaterLayer,
} from 'components';
import AtlasPropTypes from 'atlas-prop-types';

import { filterFeatures } from 'utils/data';

import 'leaflet/dist/leaflet.css';
import './Atlas.css';

import {
  BASE_LAYER_URL,
  BASE_LAYER_ATTRIBUTION,
  UNESCO_ATTRIBUTION,
  NATURAL_EARTH_ATTRIBUTION,
} from './constants';

export default class Atlas extends Component {
  static propTypes = {
    data: AtlasPropTypes.geojsonObject,
    counts: AtlasPropTypes.countObject,
    circleTypes: AtlasPropTypes.filters,
    showAridity: PropTypes.bool,
    showTemperatures: PropTypes.bool,
    showCircles: PropTypes.bool,
    print: PropTypes.bool,
    isSidebarOpened: PropTypes.bool,
    onRender: PropTypes.func,
    onCirclesCreated: PropTypes.func.isRequired,
    onCirclesAdded: PropTypes.func.isRequired,
    onZoom: PropTypes.func,
    onMapReady: PropTypes.func,
    bindMapReference: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    print: false,
    isSidebarOpened: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      mapRef: null,
      showTooltip: false,
      tooltipPosition: null,
      tooltipData: null,
    };
  }

  onClick(e) {
    // useful to avoid looking up for deserts.
    const {
      data: { aridity, temperatures, circles },
    } = this.props;

    const searchInFeatures = {
      aridity,
      temperatures,
      circles,
    };

    const features = filterFeatures(searchInFeatures, e.latlng);
    if (Object.keys(features).length) {
      this.showTooltip(e.latlng, features);
    } else {
      this.hideTooltip();
    }
  }

  onZoomEnd() {
    if (!this.zoomEndTimeoutID) {
      this.zoomEndTimeoutID = setTimeout(() => {
        this.props.onZoom();
        this.zoomEndTimeoutID = null;
      }, 1000);
    }
  }
  
  hideTooltip() {
    this.setState({ showTooltip: false });
  }

  showTooltip(tooltipPosition, tooltipData) {
    this.setState({ showTooltip: true, tooltipPosition, tooltipData });
  }
  
  bindContainer(mapRef) {
    if (!mapRef) { return; }
    this.mapRef = mapRef;
    this.map = mapRef.leafletElement;
    this.map.on('zoomend', () => this.onZoomEnd());
    this.props.bindMapReference(this.map);
  }

  render() {
    const { showTooltip, tooltipPosition, tooltipData } = this.state;
    const {
      data,
      counts,
      showCircles,
      showAridity,
      showTemperatures,
      onRender,
      onMapReady,
      circleTypes,
      onCirclesAdded,
      onCirclesCreated,
      isSidebarOpened,
    } = this.props;
    const {
      deserts,
      lakesAndRivers,
      circles,
      waterLabels,
      ...aridityAndTemperatures
    } = data;
    const bbox = [
      -179.2165527343741, -56.157571400448376,
      181.00012207031295, 84.62359619140625,
    ];
    const klass = `sidebar-${isSidebarOpened ? 'opened' : 'closed'}`;
    this.position = [10, 35];
    this.zoom = 3;
    const bounds = new LatLngBounds(
      new LatLng(bbox[0] - 20, bbox[1] - 150),
      new LatLng(bbox[2] + 20, bbox[3] + 150)
    );
    return (
      <Map
        whenReady={onMapReady}
        ref={(ref) => this.bindContainer(ref)}
        className={klass}
        onclick={(e) => this.onClick(e)}
        maxBounds={bounds}
        minZoom={2}
        maxZoom={7}
        renderer={canvas()}
        animate
        zoomControl={false}
        center={this.position}
        zoom={this.zoom}
      >
        <ContextualInfoPopup
          onClose={() => this.hideTooltip()}
          show={showTooltip}
          data={tooltipData}
          map={this.map}
          position={tooltipPosition}
        />
        <ZoomControl position={'topright'} />
        <CedejWatermark position={'bottomright'} width={50} />
        <ScaleControl position={'bottomright'} />
        <TileLayer url={BASE_LAYER_URL} attribution={BASE_LAYER_ATTRIBUTION} />

        <AridityTemperaturesLayer
          onRendered={onRender}
          showAridity={showAridity}
          showTemperatures={showTemperatures}
          zIndex={400}
          data={aridityAndTemperatures}
          counts={counts}
          attribution={UNESCO_ATTRIBUTION}
        />

        <WaterLayer
          data={lakesAndRivers}
          zIndex={500}
          attribution={NATURAL_EARTH_ATTRIBUTION}
        />

        <CirclesLayer
          types={circleTypes}
          onRender={onRender}
          onCirclesAdded={onCirclesAdded}
          onCirclesCreated={onCirclesCreated}
          show={showCircles}
          circles={circles.features}
        />

        <WaterLabelsLayer
          minZoom={3}
          data={waterLabels}
        />
        <DesertLabelsLayer minZoom={4} data={deserts} />
      </Map>
    );
  }
}
