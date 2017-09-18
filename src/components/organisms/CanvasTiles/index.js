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
    showAridity:PropTypes.bool, 
    showTemperatures:PropTypes.bool, 
  };

  static defaultProps = {
    onRendered: noop
  };


  createLeafletElement(props) {
    const { delegate, onRendered, data, ...options }= this.getOptions(props);

    this.delegate = new delegate(data);
    return canvasTiles(this.delegate, onRendered, options);
  }
  
  updateAridityVisiblity(visibility){
    this.delegate.updateAridityVisibility(visibility);
    this.redraw();
  }

  updateTemperaturesVisiblity(visibility){
    this.delegate.updateTemperaturesVisibility(visibility);
    this.redraw();
  }

  updateData(data){
    this.delegate.updateData(data);
    this.redraw();
  }

  redraw(){
    this.leafletElement.redraw();
    this.props.onRendered && this.props.onRendered();
  }
  updateLeafletElement(
    {
      showAridity: fromAridityVisibility,
      showTemperatures: fromTemperaturesVisibility,
      data:{ temperatures: fromTemps, aridity:fromAridity}
    },
    {
      showAridity: toAridityVisibility,
      showTemperatures: toTemperaturesVisibility,
      data:{ temperatures:toTemps, aridity:toAridity}
    }
  ) {
    const diffAridity = fromAridity.features.length != toAridity.features.length;
    const diffTemps = fromTemps.features.length != toTemps.features.length;
    if(diffTemps || diffAridity){
      this.updateData({
        aridity:toAridity,
        temperatures: toTemps
      });
    }

    if(fromAridityVisibility != toAridityVisibility){
      this.updateAridityVisiblity(toAridityVisibility);
    }

    if(fromTemperaturesVisibility != toTemperaturesVisibility){
      this.updateTemperaturesVisiblity(toTemperaturesVisibility);
    }
  }

}

export default CanvasTilesLayer;
