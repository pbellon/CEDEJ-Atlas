import leafletImage from 'leaflet-image';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  TileLayer,
  GeoJSON,
  Popup,
  LayerGroup,
  Pane,
  Circle,
  ScaleControl
} from 'react-leaflet';
import { canvas  } from 'leaflet';


import 'leaflet/dist/leaflet.css';
import './Atlas.css';
import {
  BASE_LAYER_URL,
  NATURAL_FEATURES_ATTRIBUTION,
  NATURAL_FEATURES_URL, 
  MAPBOX_WATER_LABEL_URL,
  MAPBOX_WATER_URL
} from './constants'; 


import CirclesLayer from './circles'; 
import { CanvasDelegate } from './canvas';
import CanvasLayer from './layer';

import { filterFeatures } from 'utils/data';

export default class Atlas extends Component {
  static propTypes = {
    data: PropTypes.object,
    showAreas: PropTypes.bool,
    showCircles: PropTypes.bool,
    print: PropTypes.bool,
    onRender: PropTypes.func,
    onCirclesCreated: PropTypes.func.isRequired,
    showContextualInfo: PropTypes.func.isRequired,
    hideContextualInfo: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultProps = {
    print: false,
  }
  
  static childContextTypes = {
    showContextualInfo: PropTypes.func,
    hideContextualInfo: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      mapRef:null,
      showPopup: false,
      features: null
    };
  }

  bindContainer(mapRef) {
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

  hidePopup(){
    this.setState({ showPopup: false });
  }

  showPopup(features){
    this.setState({ showPopup: true, features }); 
  }

  onHover(e){
    const { data, showContextualInfo, hideContextualInfo } = this.props;
    const features = filterFeatures(data,  e.latlng);
    if(Object.keys(features).length){
      showContextualInfo(features);
    } else {
      hideContextualInfo();
    }
  }

  render() {
    const {
      data,
      showCircles,
      showAreas,
      onRender,
      showContextualInfo,
      hideContextualInfo,
      onCirclesCreated,
    } = this.props;
    const bbox = [
      -179.2165527343741
      , -56.157571400448376
      ,  181.00012207031295
      ,  84.62359619140625
    ];
    // const { mapRef } = this.state;
    const position = [10, 35];
    return (
      <Map
        onmousemove={ this.onHover.bind(this) }
        minZoom={2}
        maxZoom={10}
        renderer={canvas()}
        animate={true}
        center={position} zoom={4}
        ref={(ref) => this.bindContainer(ref)}>

      <ScaleControl position={ 'bottomleft' }/>
      <TileLayer url={ BASE_LAYER_URL } />
      <CanvasLayer
        onRendered={ onRender }
        opacity={ showAreas ? 1 : 0 }
        bbox={ bbox } 
        zIndex={ 400 } 
        data={data} delegate={ CanvasDelegate }/>
      <CirclesLayer
        onCirclesCreated={ onCirclesCreated }
        showContextualInfo={ showContextualInfo }
        hideContextualInfo={ hideContextualInfo }
        show={ showCircles } circles={ data.circles }/>
      
      <TileLayer zIndex={ 500 } url={ MAPBOX_WATER_URL } />
      <TileLayer zIndex={ 600 } url={ MAPBOX_WATER_LABEL_URL } />
      </Map>
    );
  }
}
