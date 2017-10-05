import PropTypes from 'prop-types';
import { MapLayer } from 'react-leaflet';

import { noop } from 'utils';

import { canvasTiles } from './layer';

class CanvasTiles extends MapLayer {
  static propTypes = {
    delegate: PropTypes.func.isRequired,
    zIndex: PropTypes.number,
    bbox: PropTypes.array,
    onRendered: PropTypes.func,
    data: PropTypes.object,
  };

  static defaultProps = {
    onRendered: noop,
  };


  createLeafletElement(props) {
    const { delegate, onRendered, data, ...options } = this.getOptions(props);

    this.delegate = new delegate(data);
    return canvasTiles(this.delegate, onRendered, options);
  }
  

  updateData(data) {
    this.delegate.updateData(data);
    this.redraw();
  }

  redraw() {
    this.leafletElement.redraw();
    this.onRendered();
  }

  onRendered() {
    this.props.onRendered && this.props.onRendered();
  }
}

export default CanvasTiles;
