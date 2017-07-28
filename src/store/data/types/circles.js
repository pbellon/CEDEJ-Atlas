import { arrToObj } from 'utils';
const COLORS = [
  {
    value:'A',
    color: '#468fba',
  },
  {
    value:'B',
    color: '#498b45'
  },
  {
    value:'C',
    color: '#e15e46'
  },
  {
    value:'D',
    color: '#fea959'
  },
  {
    value:'E',
    color: '#7e6ba3'
  },
  {
    value:'F',
    color: '#858288'
  }
];
const COLORS_OBJ = arrToObj(COLORS);
export const circleColor = (circle)=>COLORS_OBJ[circle.properties.colours].color;

const NUMBER_OF_MONTHS = [
  {
    value: '01',
    months: [1],
  },
  {
    value: '02',
    months: [1,3],
  },
  {
    value: '03',
    months: [4,5],
  },
  {
    value: '04',
    months: [6,7],
  },
  {
    value: '05',
    months: [8,9],
  },
  {
    value: '06',
    months: [10,11]
  },
  {
    value: '07',
    months: [12],
  }
];

const NB_MONTHS_OBJ = arrToObj(NUMBER_OF_MONTHS);
export const circleMonths = (circle)=>NB_MONTHS_OBJ[circle.properties.size_].months;
