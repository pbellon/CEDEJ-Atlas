import React from 'react';

import { render } from 'react-dom';
import styled from 'styled-components';
import formats from 'utils/formats';
import { debugCanvas } from 'utils';
import { AtlasLegend } from 'components'; 

import html2canvas from 'html2canvas'; 

// convert rendered legend to an image with html2canvas.
const convertToImage = ({legendNode, ...data}) => {
  return new Promise((resolve, reject)=>{
    const size = {
      width: formats.A4px[1],
      height: formats.A4px[0],
    }
    const opts = {
      ...size,
      onrendered: (canvas)=>{
        resolve(canvas);
      }
    };
    try {
      html2canvas(legendNode, opts);
    } catch (e) {
      reject(e);
    }
    
  });
}

// render the legen HTML node
const renderHtml = ({layers, filters, ...data}) => {
  const removeAllChildren = (node)=>{
    node.childNodes.forEach(
      (child)=>node.removeChild(child)
    );
  };

  return new Promise((resolve, reject) => {
    try {
      const renderContainer = document.getElementById('render');
      removeAllChildren(renderContainer);
      const props = { layers, filters, print: true };
      render(
        <AtlasLegend {...props}/>,
        renderContainer,
        ()=>{
          const rendered =  renderContainer.querySelector('.legend');
          resolve({legendNode: rendered, ...data });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

// allows to render the map's legend & convert it to an image
const renderPrintLegend = (data)=>{
  return new Promise((resolve, reject)=>{
    renderHtml(data)
      .then(convertToImage)
      .then((canvas)=>{
        resolve({legendImage: canvas, ...data});
      }).catch(reject);
  });
}

export default renderPrintLegend;
