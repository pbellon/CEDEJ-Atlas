import { arrToObj, inRange } from 'utils';

const TEMPERATURES = [
  {
    value: 1,
    winter: 'A', // [20, 30],
    summer: 'A', // [30],
    color: '#b76648',
  },
  {
    value: 2,
    winter: 'A', // [20, 30],
    summer: 'B', // [20, 30],
    color: '#e07a54',
  },
  {
    value: 3,
    winter: 'B', // [10, 20],
    summer: 'A', // [30],
    color: '#bf7534',
  },
  {
    winter: 'B', //[10, 20],
    summer: 'B', // [20, 30],
    value: 4,
    color: '#e68839',
  },
  {
    value: 5,
    winter: 'B', // [10, 20],
    summer: 'C', // [10, 20],
    color: '#edad78',
  },
  {
    value: 6,
    winter: 'C', // [0, 10],
    summer: 'A', // [30],
    color: '#c19931',
  },
  {
    value: 7,
    winter: 'C', // [0, 10],
    summer: 'B', // [20, 30],
    color: '#e3b131',
  },
  {
    value: 8,
    winter: 'C', // [0, 10],
    summer: 'C', //[10, 20],
    color: '#e8c66b',
  },
  {
    value: 9,
    winter: 'D', // [0],
    summer: 'A', // [30],
    color: '#95a053',
  },
  {
    winter: 'D', // [0],
    summer: 'B', // [20, 30],
    value: 10,
    color: '#abb85c',
  },
  {
    winter: 'D', // [0],
    summer: 'C', // [10, 20],
    value: 11,
    color: '#c4cd8d',
  },
];

const TEMPS_OBJ = arrToObj(TEMPERATURES);

export const filter = ({
  winter, summer,
}) => {
  const winterVisible = Object.keys(winter)
    .map(type => winter[type])
    .filter(type => type.visible)
    .map(type => type.name);

  const summerVisible = Object.keys(summer)
    .map(type => summer[type])
    .filter(type => type.visible)
    .map(type => type.name);

  return TEMPERATURES
    .filter(temp => (
      (
        winterVisible.indexOf(temp.winter) > -1 
      ) && (
        summerVisible.indexOf(temp.summer) > -1
      )
    ));
}

export const getSummerRange = (value)=>findByValue(value).summer;
export const getWinterRange = (value)=>findByValue(value).winter;

export const findByValue = (value)=>TEMPS_OBJ[value]

export const findTemperature = ({ properties: { Temperatur } }) => (
  findByValue(Temperatur)
);


export default TEMPERATURES;

