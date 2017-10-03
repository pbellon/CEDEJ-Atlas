import * as temperatures from 'utils/temperatures';
import * as circles from 'utils/circles';

const areaColor = (value) => temperatures.findByValue(value).color;

const circleColor = (feature) => circles.circleColor(feature);

const mapStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};


export { circleColor, areaColor, mapStyle };
