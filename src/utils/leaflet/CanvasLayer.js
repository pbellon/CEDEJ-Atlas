import PropTypes from 'prop-types';
import { GridLayer, PropTypes as propTypes } from 'react-leaflet';

import { canvasLayer } from './CanvasOverlay';

const childrenType = propTypes.childrenType;

export default class CanvasLayer extends GridLayer {
  static propTypes = {
    children: childrenType,
    opacity: PropTypes.number,
    drawCanvas: PropTypes.func.isRequired,
    zIndex: PropTypes.number,
  };

  createLeafletElement(props: Object): Object {
    const { drawCanvas, ...options } = props;
    return canvasLayer(drawCanvas, this.getOptions(options));
  }
}
