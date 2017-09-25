import React from 'react';

import { render } from 'react-dom';
import styled from 'styled-components';
import formats from 'utils/formats';
import { debugCanvas } from 'utils';
import { AtlasLegend, LegendMoreInfosPrint } from 'components'; 

import html2canvas from 'html2canvas'; 

// convert rendered legend to an image with html2canvas.
const convertToImage = (node) => {
  return new Promise((resolve, reject)=>{
    const size = {
      width: formats.A4px[1],
      height: formats.A4px[0] + 400,
    }
    const opts = {
      ...size,
      onrendered: (canvas)=>{
        resolve(canvas);
      }
    };
    try {
      html2canvas(node, opts);
    } catch (e) {
      reject(e);
    }
    
  });
}

// render the legen HTML node
const renderHtml = (component) => {
  const removeAllChildren = (node)=>{
    node.childNodes.forEach(
      (child)=>node.removeChild(child)
    );
  };

  return new Promise((resolve, reject) => {
    try {
      const renderContainer = document.getElementById('render');
      renderContainer.parentNode.style.overflow = 'visible';
      removeAllChildren(renderContainer);
      render(
        component,
        renderContainer,
        ()=>{
          const rendered =  renderContainer.childNodes[0];
          renderContainer.parentNode.style.overflow = 'hidden';
          resolve(rendered);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const renderLegend = ({layers, filters, circleSizes, ...data}) => {
  const props = { layers, filters, print: true, circleSizes };
  const component = <AtlasLegend {...props}/>;
  return new Promise((resolve, reject)=>{
    renderHtml(component).then(convertToImage).then((canvas)=>{
      resolve({legendImage:canvas, ...data});
    });
  });
}

const renderMoreInfos = (data)=>{
  return new Promise((resolve, reject) => {
    renderHtml(<LegendMoreInfosPrint/>).then(convertToImage).then((canvas)=>{
      resolve({legendMoreInfosImage: canvas, ...data});
    });
  })
};

// allows to render the map's legend & convert it to an image
const renderPrintLegend = (data)=>{
  return renderLegend(data)
    .then(renderMoreInfos); 
}

export default renderPrintLegend;
