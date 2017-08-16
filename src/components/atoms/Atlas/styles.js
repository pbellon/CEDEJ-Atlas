import { temperatures, circles } from '../../../store/data/types';

const areaColor = (feature) => temperatures.findTemperature(feature).color;
const circleColor = (feature) => circles.circleColor(feature);

const circleStyle = (circle)=>{
  const color = circleColor(circle);
  return {
    stroke: false,
    fillOpacity: 1,
    opacity:1,
    color: color,
    fillColor: color,
  };
};

const mapStyle = {
  position: 'absolute',
  top: 0, bottom: 0, left: 0, right: 0,
};


export { circleColor, areaColor, circleStyle, mapStyle };
