import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'; 
import { Control, DomUtil } from 'leaflet'; 
import { MapControl } from 'react-leaflet';
import Logo from './logo.png' 

import './styles.css'; 

const Watermark = Control.extend({
  options: {
    position: 'bottomright',
    logoUrl: Logo,
    logoAltText: ''
    
  },

  onAdd: function(map){
    const className = 'leaflet-watermark';
    const container = DomUtil.create('div', className);
    const options = this.options;
    container.style.width = `${options.width}px`;
    this._addWatermark(options, `${className}-link`, container);
    return container;
  },

  _addWatermark(options, className, container){
    const watermark= DomUtil.create('a', className, container);
    const image = DomUtil.create('img', null, watermark);
    image.src = options.logoUrl;
    image.alt = options.logoTitle;
    watermark.target = '_blank';
    watermark.href = options.linkUrl;
    watermark.title = options.linkTitle; 

  }
})

class CedejWatermark extends MapControl {
  static propTypes = {
    width: PropTypes.number,
    logoUrl: PropTypes.string,
    logoTitle: PropTypes.string,
    linkUrl: PropTypes.string,
    linkTitle: PropTypes.string,
  }

  static defaultProps = {
    width: 50, 
  }
  createLeafletElement(props){
    return new Watermark({
      logoUrl: Logo,
      logoAlt: 'Logo du CEDEJ',
      linkUrl: 'http://cedej-eg.org/',
      linkTitle: 'Visiter le site du CEDEJ',
      ...props
    });
  }

}

export default CedejWatermark;
