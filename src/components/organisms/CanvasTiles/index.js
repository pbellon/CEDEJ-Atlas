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
    if(!visibility){
      this.delegate.disableMask();
    } else {
      this.delegate.enableMask();
    }
    this.delegate.updateAridityVisibility(visibility);
    this.redraw();
  }

  updateTemperaturesVisiblity(visibility){
    if(!visibility){
      this.delegate.disableMask();
    } else {
      this.delegate.enableMask();
    }
    this.delegate.updateTemperaturesVisibility(visibility);
    this.redraw();
  }

  updateData(data){
    this.delegate.updateData(data);
    this.redraw();
  }

  redraw(){
    this.leafletElement.redraw();
    this.onRendered();
  }

  onRendered(){
    this.props.onRendered && this.props.onRendered();
  }
  updateLeafletElement(
    {
      showAridity: fromAridityVisibility,
      showTemperatures: fromTemperaturesVisibility,
      data:{
        temperatures: fromTemps,
        aridity:fromAridity,
      }
    },
    {
      showAridity: toAridityVisibility,
      showTemperatures: toTemperaturesVisibility,
      data:{
        temperatures:toTemps,
        aridity:toAridity,
      },
      counts: {
        temperatures: tempsCounts,
        aridity: aridityCounts,
      }
    }
  ) {
    console.log('counts', tempsCounts, aridityCounts);
    const shouldEnableMask = (
      (
        tempsCounts.original != tempsCounts.current
      ) && (
        tempsCounts.current > 0
      )
    ) || (
        (
          aridityCounts.original != aridityCounts.current
        ) && (
          aridityCounts.current > 0
        )
    );
    console.log('shouldEnableMask', shouldEnableMask);
    const diffAridity = fromAridity.features.length != toAridity.features.length;
    const diffTemps = fromTemps.features.length != toTemps.features.length;
    if(diffTemps || diffAridity){
      if(shouldEnableMask){
        this.delegate.enableMask();
      } else {
        this.delegate.disableMask();
      }
      this.updateData({
        aridity:toAridity,
        temperatures: toTemps
      });
    } else {
      this.onRendered();
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
