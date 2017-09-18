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

    this.props.bindMapReference(this.map);

    // if(mapRef){ this.setState({mapRef: mapRef.leafletElement}); }
    /* 
    if (this.props.onRender) {
      this.map = this.map || mapRef.leafletElement;
      // TODO: replace by dispatch or props callback
      leafletImage(this.map, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        const url = canvas.toDataURL();
        // this.props.onRender(url);
      });
    }
    */
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
      circleTypes,
      showContextualInfo,
      hideContextualInfo,
      onCirclesCreated,
      isSidebarOpened,
    } = this.props;
    const { deserts, ...canvasData } = data;
    const bbox = [
      -179.2165527343741, -56.157571400448376,
      181.00012207031295,  84.62359619140625
    ];
    const klass = `sidebar-${isSidebarOpened ? 'opened' : 'closed'}`;
    const position = [10, 35];
    const bounds = new LatLngBounds(
      new LatLng(bbox[0] - 20, bbox[1] - 150), 
      new LatLng(bbox[2] + 20, bbox[3] + 150) 
    );
    return (
      <Map
        ref={(ref) => this.bindContainer(ref)}
        className={klass}
        onclick={this.onClick.bind(this)}
        maxBounds={bounds}
        minZoom={2}
        maxZoom={9}
        renderer={canvas()}
        animate={true}
        zoomControl={false}
        center={position} zoom={3} >
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
      
      { /* <CanvasLayer
        onRendered={ onRender }
        opacity={ showAridity ? 1 : 0 }
        bbox={ bbox } 
        zIndex={ 400 } 
        data={canvasData}
        delegate={ CanvasDelegate }/> */ }


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
        onCirclesCreated={ onCirclesCreated }
        showContextualInfo={ showContextualInfo }
        hideContextualInfo={ hideContextualInfo }
        show={ showCircles } circles={ data.circles.features }/>
      <TileLayer zIndex={ 500 } url={ MAPBOX_WATER_URL } />
      <TileLayer zIndex={ 600 } url={ MAPBOX_WATER_LABEL_URL } />
      <DesertsLayer
        minZoom={4} data={ deserts }/>
      </Map>
    );
  }
}
