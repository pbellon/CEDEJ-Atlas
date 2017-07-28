import { arrToObj } from 'utils';

const TEMPERATURES = [
  {
    value: 0,
    color: 'rgba(0,0,0,0)',
  }, 
  {
    value: 1,
    winter: [ 20, 30 ],
    summer: [ 30 ], 
    color: '#b76648',
  },
  {
    value: 2,
    winter: [ 20, 30],
    summer: [ 20, 30],
    color: '#e07a54',
  },
  {
    value: 3,
    winter: [10, 20],
    summer: [ 30 ],
    color: '#bf7534',
  },
  {
    winter: [10, 20],
    summer: [20, 30],
    value: 4,
    color: '#e68839',
  },
  {
    value:5, 
    winter: [10, 20],
    summer: [10, 20],
    color: '#edad78'
  },
  {
    value: 6,
    winter: [0, 10],
    summer: [30],
    color: '#c19931',
  },
  {
    value:7,
    winter: [0, 10],
    summer: [20, 30],
    color: '#e3b131',
  },
  {
    value:8,
    winter: [0, 10],
    summer: [10, 20],
    color: '#e8c66b',
  },
  {
    value:9,
    winter: [0],
    summer: [30],
    color:'#95a053',
  },
  {
    winter: [0],
    summer: [20,30],
    value:10, 
    color: '#abb85c',
  },
  {
    winter: [0],
    summer: [10, 20],
    value: 11,
    color: '#c4cd8d',
  }
];
const TEMPS_OBJ = arrToObj(TEMPERATURES);

export const temperaturesTypesInRange = (rangeType, range)=>(
  TEMPERATURES
    .filter((temp)=>{
      const tempRange = temp[rangeType];
      return (
        tempRange[0] >= range[0] 
      ) && (
        tempRange[tempRange.length - 1] <= range[range.length-1]
      );
    }).map((t)=>t.value)
);

export const findTemperature = (feature)=>TEMPS_OBJ[feature.properties.Temperatur];

export default TEMPERATURES;

