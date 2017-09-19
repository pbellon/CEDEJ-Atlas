import React from 'react';

import { Atlas } from 'components';
import { Print as PrintContainer } from 'containers';

import { renderToString } from 'react-dom/server';
import { render } from 'react-dom';

import StyleWrapper from './StyleWrapper';

const renderHtml = ({mapPreview, mapReference, layers, filters}) => {
  return new Promise((resolve, reject) => {
    try {
      let ref;
      const renderContainer = document.getElementById('render');
      const props = {
        width: 3508,
        height: 2480,
        layers,
        filters,
        mapPreview,
        mapReference,
      };
      render(
        <PrintContainer onRef={(_ref)=>ref=_ref} {...props}/>,
        renderContainer,
        ()=>resolve(ref)
      );
    } catch (e) {
      reject(e);
    }
  });
};

export default renderHtml;
