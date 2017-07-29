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
}

export { circleColor, areaColor, circleStyle };
