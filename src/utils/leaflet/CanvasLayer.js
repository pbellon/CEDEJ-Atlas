import PropTypes from 'prop-types';
import { GridLayer } from 'react-leaflet';

import L from 'leaflet';

// import 'leaflet-canvas-geojson/dist/leaflet-canvas-geojson';

const canvasLayer = (drawCanvas, options) => {
  return new L.Canvas({ renderer: drawCanvas, ...options});
};


export default class CanvasLayer extends GridLayer {
  static propTypes = {
    data: PropTypes.array,
    opacity: PropTypes.number,
    zIndex: PropTypes.number,
    drawCanvas: PropTypes.func.isRequired,
  };

  createLeafletElement(props) {
    const { drawCanvas, ...options} = props;
    return canvasLayer(drawCanvas, this.getOptions(options));
  }

}
