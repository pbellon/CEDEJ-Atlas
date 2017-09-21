import React from 'react';

import { Atlas } from 'components';
import { Print as PrintContainer } from 'containers';

import { renderToString } from 'react-dom/server';
import { render } from 'react-dom';

import StyleWrapper from './StyleWrapper';

const renderHtml = ({mapPreview, mapReference, layers, filters}) => {
  return new Promise((resolve, reject) => {
    try {
      const renderContainer = document.getElementById('render');
      renderContainer.childNodes.forEach(
        (node)=>renderContainer.removeChild(node)
      );
      const props = {
        className: 'rendered',
        width: 3508,
        height: 2480,
        layers,
        filters,
        mapPreview,
        mapReference,
      };
      render(
        <PrintContainer {...props}/>,
        renderContainer,
        ()=>{
          const rendered =  renderContainer.querySelector('.rendered');
          resolve(rendered);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default renderHtml;
