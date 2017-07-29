export CanvasTest from './canvas';
import leafletImage from 'leaflet-image';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, GeoJSON, LayerGroup, Pane, Circle } from 'react-leaflet';
import { canvas  } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './Atlas.css';

import VectorGridLayer from './vectorGridLayer.js';
import { CanvasDelegate } from './canvas';
import CanvasLayer from './layer';
import { circleStyle } from './styles';

import vectorLayerStyles from './vectorLayerStyles';

const BASE_LAYER_URL = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png';

const NATURAL_FEATURES_URL = 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}.png';

const NATURAL_FEATURES_ATTRIBUTION = '&copy; Powerded by <a href="http://www.esri.com/">ESRI</a> world reference overlay';

const MAPBOX_URL = 'https://api.mapbox.com/styles/v1/skoli/cj5m6lw8p35a82rmtf5ur046w/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2tvbGkiLCJhIjoiY2o1bTZpeHBvMGl4djMyb2RmZ3h5OGI0diJ9.OECj4b33D6Pnq7Zlp04wtA';

const VECTOR_TILE_URL = 'https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf';

const renderCircles = (show, circles)=>{
  if(!show){ return []; }
  return circles.map((circle,key)=>{
    const coords = circle.geometry.coordinates;
    const center = [ coords[1], coords[0]];
    const radius = 10000 + 5000 * parseInt(circle.properties.size_);
    const style = circleStyle(circle);
    const circleElem = (
      <Circle
      key={key}
      radius={radius}
      interactive={false}
      center={center}
      {...style} />
    );
    return circleElem;
  });
};

export default class Atlas extends Component {
  static propTypes = {
    data: PropTypes.object,
    showAreas: PropTypes.bool,
    showCircles: PropTypes.bool,
    print: PropTypes.bool,
    onRender: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  static defaultPropTypes = {
    print: false,
  }
  constructor(props){
    super(props);
    this.state = {
      mapRef:null,
    };
  }

  bindContainer(mapRef) {
    // if(mapRef){ this.setState({mapRef: mapRef.leafletElement}); }
    if (this.props.onRender) {
      this.map = this.map || mapRef.leafletElement;
      // TODO: replace by dispatch or props callback
      leafletImage(this.map, (err, canvas) => {
        if (err) {
          console.error(err);
          return;
        }
        const url = canvas.toDataURL();
        this.props.onRender(url);
      });
    }
  }

  render() {
    const { data, showCircles, showAreas } = this.props;
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
        minZoom={3}
        maxZoom={8}
        renderer={canvas()}
        animate={true}
        center={position} zoom={4}
        ref={(ref) => this.bindContainer(ref)}>
        <TileLayer url={ BASE_LAYER_URL } />
        {
         // <VectorGridLayer zIndex={ 450 } url={ VECTOR_TILE_URL } vectorTileLayerStyles={ vectorLayerStyles.names }/> 
        }
        <TileLayer zIndex={ 500 }
             url={ MAPBOX_URL }
        />
        <CanvasLayer
          opacity={ showAreas ? 1 : 0 }
          bbox={ bbox } 
          zIndex={ 400 } 
          data={data} delegate={ CanvasDelegate } />
        
        <LayerGroup>{ renderCircles(showCircles, data.circles) }</LayerGroup>

      </Map>
    );
  }
}
