const COLORS = {
  circles: {
    A: '#468fba',
    B: '#498b45',
    C: '#e15e46',
    D: '#fea959',
    E: '#7e6ba3',
    F: '#858288',
  },

  areas: {
    0: 'rgba(0,0,0,0)',
    1: '#b76648',
    2: '#e07a54',
    3: '#bf7534',
    4: '#e68839',
    5: '#edad78',
    6: '#c19931',
    7: '#e3b131',
    8: '#e8c66b',
    9: '#95a053',
    10: '#abb85c',
    11: '#c4cd8d',
  }
}

const areaColor = ({properties}) => COLORS.areas[properties.Temperatur];
const circleColor = ({properties}) => COLORS.circles[properties.colours];

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
