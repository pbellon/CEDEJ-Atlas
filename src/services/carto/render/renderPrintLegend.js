import React from 'react';
import { render } from 'react-dom';
import html2canvas from 'html2canvas';

import { AtlasLegend, LegendMoreInfosPrint } from 'components';

// convert rendered legend to an image with html2canvas.
const convertToImage = (node) => {
  return new Promise((resolve, reject) => {
    const style = window.getComputedStyle(node);
    const h = Math.round(
      parseFloat(style.getPropertyValue('height').replace('px', ''))
    );
    const w = Math.round(
      parseFloat(style.getPropertyValue('width').replace('px', ''))
    );
    const size = {
      width: w,
      height: h,
    };

    const opts = {
      ...size,
      onrendered: (canvas) => {
        resolve(canvas);
      },
    };
    try {
      html2canvas(node, opts);
    } catch (e) {
      reject(e);
    }
  });
};

// render the legen HTML node
const renderHtml = (component) => {
  const removeAllChildren = (node) => {
    node.childNodes.forEach(
      (child) => node.removeChild(child)
    );
  };

  return new Promise((resolve, reject) => {
    try {
      const renderContainer = document.getElementById('render');
      removeAllChildren(renderContainer);
      render(
        component,
        renderContainer,
        () => {
          const rendered = renderContainer.childNodes[0];
          resolve(rendered);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const renderLegend = ({ layers, filters, circleSizes, ...data }) => {
  const props = { layers, filters, print: true, circleSizes };
  const component = <AtlasLegend {...props} />;

  return new Promise((resolve) => {
    renderHtml(component).then(convertToImage).then((canvas) => {
      resolve({ legendImage: canvas, ...data });
    });
  });
};

const renderMoreInfos = (data) => {
  return new Promise((resolve) => {
    renderHtml(<LegendMoreInfosPrint />).then(convertToImage).then((canvas) => {
      resolve({ legendMoreInfosImage: canvas, ...data });
    });
  });
};

// allows to render the map's legend & convert it to an image
const renderPrintLegend = (data) => {
  return new Promise((resolve) => {
    const holder = document.querySelector('.render-holder');
    holder.style.overflow = 'visible';

    renderLegend(data)
      .then(renderMoreInfos)
      .then((data) => {
        holder.style.overflow = 'hidden';
        resolve(data);
      });
  });
};

export default renderPrintLegend;
