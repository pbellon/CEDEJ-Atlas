import leafletImage from 'leaflet-image';
import styled from 'styled-components';
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
  LatLng
} from 'leaflet';

import {
  CedejWatermark,
  CirclesLayer,
  ContextualInfoPopup,
  DesertsLayer,
  CanvasTiles, 
} from 'components';

import { filterFeatures } from 'utils/data';
import { sidebar, navbar } from 'utils/styles';

import 'leaflet/dist/leaflet.css';
import './Atlas.css';

import {
  BASE_LAYER_URL,
  NATURAL_FEATURES_ATTRIBUTION,
  NATURAL_FEATURES_URL, 
  MAPBOX_WATER_LABEL_URL,
  MAPBOX_WATER_URL
} from './constants'; 

import { CanvasDelegate } from './canvas';

export default class Atlas extends Component {
  static propTypes = {
    data: PropTypes.object,
    showAridity: PropTypes.bool,
    showTemperatures: PropTypes.bool,
    showCircles: PropTypes.bool,
    circleTypes: PropTypes.object,
    print: PropTypes.bool,
    onRender: PropTypes.func,
    isSidebarOpened: PropTypes.bool,
    onCirclesCreated: PropTypes.func.isRequired,
    onCirclesAdded: PropTypes.func.isRequired,
    showContextualInfo: PropTypes.func.isRequired,
    hideContextualInfo: PropTypes.func.isRequired,
    bindMapReference: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    print: false,
    isSidebarOpened: true,
  }
  
  static childContextTypes = {
    showContextualInfo: PropTypes.func,
    hideContextualInfo: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      mapRef:null,
      showTooltip: false,
      tooltipPosition: null,
      tooltipData: null,
    };
  }

  bindContainer(mapRef) {
    if(!mapRef){ return; }
    this.mapRef = mapRef;
    this.map = mapRef.leafletElement;
    this.map.on('zoomend', ()=>{
      setTimeout(()=>this.props.onZoom(), 1000);
    });
    this.props.bindMapReference(this.map);
  }
  
  hideTooltip(){
    this.setState({ showTooltip: false });
  }

  showTooltip(tooltipPosition, tooltipData){
    this.setState({ showTooltip: true, tooltipPosition, tooltipData }); 
  }

  onClick(e){
    // useful to avoid looking up for deserts.
    const { data:{ deserts, ...searchInFeatures}} = this.props;
    const features = filterFeatures(searchInFeatures,  e.latlng);
    if(Object.keys(features).length){
      this.showTooltip(e.latlng, features);
    } else {
      this.hideTooltip();
    }
  }

  render() {
    const { showTooltip, tooltipPosition, tooltipData } = this.state;
    const {
      data,
      showCircles,
      showAridity,
      showTemperatures,
      onRender,
      onMapReady,
      circleTypes,
      showContextualInfo,
      hideContextualInfo,
      onCirclesAdded,
      onCirclesCreated,
      isSidebarOpened,
    } = this.props;
    const { deserts, ...canvasData } = data;
    const bbox = [
      -179.2165527343741, -56.157571400448376,
      181.00012207031295,  84.62359619140625
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
        onclick={this.onClick.bind(this)}
        maxBounds={bounds}
        minZoom={2}
        maxZoom={9}
        renderer={canvas()}
        animate={true}
        zoomControl={false}
        center={this.position} zoom={this.zoom}>
      <ContextualInfoPopup
        onClose={ this.hideTooltip.bind(this) } 
        show={ showTooltip }
        data={ tooltipData }
        map={ this.map }
        position={tooltipPosition} />
      <ZoomControl position={'topright'} />
      <CedejWatermark position={ 'bottomright' } width={50} />
      <ScaleControl position={ 'bottomright' }/>
      <TileLayer url={ BASE_LAYER_URL } />

      <CanvasTiles
        onRendered={ onRender }
        showAridity={ showAridity }
        showTemperatures={ showTemperatures }
        zIndex={ 400 } 
        data={ canvasData }
        delegate={ CanvasDelegate }/>
      <CirclesLayer
        types={circleTypes}
        onRender={ onRender } 
        onCirclesAdded={ onCirclesAdded }
        onCirclesCreated={ onCirclesCreated }
        showContextualInfo={ showContextualInfo }
        hideContextualInfo={ hideContextualInfo }
        show={ showCircles } circles={ data.circles.features }/>
      <TileLayer zIndex={ 500 } url={ MAPBOX_WATER_URL } />
      <DesertsLayer
        minZoom={4} data={ deserts }/>
      </Map>
    );
  }
}
