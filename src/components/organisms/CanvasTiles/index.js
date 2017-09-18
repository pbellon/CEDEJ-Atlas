import PropTypes from 'prop-types';
import { MapLayer } from 'react-leaflet';

import { noop } from 'utils';

import { canvasTiles } from './layer';

class CanvasTilesLayer extends MapLayer {
  static propTypes = {
    delegate: PropTypes.func,
    zIndex: PropTypes.number,
    bbox: PropTypes.array,
    onRendered: PropTypes.func,
  };

  static defaultProps = {
    onRendered: noop
  };

  createLeafletElement(props) {
    const { delegate, onRendered, data, ...options }= this.getOptions(props);
    return canvasTiles(new delegate(data), onRendered, options);
  }

  updateLeafletElement(
    {
      opacity: fromOpacity,
      data:{ temperatures: fromTemps, aridity:fromAridity}
    },
    {
      opacity: toOpacity,
      data:{ temperatures:toTemps, aridity:toAridity}
    }
  ) {
    const diffAridity = fromAridity.features.length != toAridity.features.length;
    const diffTemps = fromTemps.features.length != toTemps.features.length;
    if(diffTemps || diffAridity){
      this.leafletElement.updateData({
        aridity:toAridity,
        temperatures: toTemps
      });
      this.leafletElement.redraw();
      this.props.onRendered();
    }
    if(fromOpacity != toOpacity){
      this.leafletElement.updateOpacity(toOpacity);
    }
  }

}

export default CanvasTilesLayer;
