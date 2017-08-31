import { arrToObj, inRange } from 'utils';

const TEMPERATURES = [
  {
    value: 1,
    winter: [20, 30],
    summer: [30],
    color: '#b76648',
  },
  {
    value: 2,
    winter: [20, 30],
    summer: [20, 30],
    color: '#e07a54',
  },
  {
    value: 3,
    winter: [10, 20],
    summer: [30],
    color: '#bf7534',
  },
  {
    winter: [10, 20],
    summer: [20, 30],
    value: 4,
    color: '#e68839',
  },
  {
    value: 5,
    winter: [10, 20],
    summer: [10, 20],
    color: '#edad78',
  },
  {
    value: 6,
    winter: [0, 10],
    summer: [30],
    color: '#c19931',
  },
  {
    value: 7,
    winter: [0, 10],
    summer: [20, 30],
    color: '#e3b131',
  },
  {
    value: 8,
    winter: [0, 10],
    summer: [10, 20],
    color: '#e8c66b',
  },
  {
    value: 9,
    winter: [0],
    summer: [30],
    color: '#95a053',
  },
  {
    winter: [0],
    summer: [20, 30],
    value: 10,
    color: '#abb85c',
  },
  {
    winter: [0],
    summer: [10, 20],
    value: 11,
    color: '#c4cd8d',
  },
];

const TEMPS_OBJ = arrToObj(TEMPERATURES);

export const filter = ({
  winter: { range: winter },
  summer: { range: summer },
}) => (
  TEMPERATURES
    .filter(temp => (
      inRange(temp.summer, summer) && inRange(temp.winter, winter)
    ))
);

export const findByValue = (value)=>TEMPS_OBJ[value]

export const findTemperature = ({ properties: { Temperatur } }) => (
  findByValue(Temperatur)
);


export default TEMPERATURES;

