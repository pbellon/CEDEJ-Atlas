import React from 'react';

import { Atlas } from 'components';
import { Atlas as AtlasContainer } from 'containers';

import { renderToString } from 'react-dom/server';
import { render } from 'react-dom';

import StyleWrapper from './StyleWrapper';

const renderHtml = () => {
  return new Promise((resolve, reject) => {
    try {
      const renderContainer = document.getElementById('render');
      const props = {
        print: true,
        width: 900,
        height: 400,
        onRender: (canvasURL) => {
          const markup = renderToString(<StyleWrapper>
            <AtlasContainer canvasURL={canvasURL} print />
          </StyleWrapper>);
          resolve(markup);
        },
      };
      render(<Atlas {...props} />, renderContainer);
    } catch (e) {
      reject(e);
    }
  });
};

export default renderHtml;
