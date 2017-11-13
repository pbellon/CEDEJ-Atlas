import * as utils from 'utils';
import i18n from 'i18n';

const DROUGHTS = [
  {
    value: 'A',
    color: '#468fba',
  },
  {
    value: 'B',
    color: '#498b45',
  },
  {
    value: 'C',
    color: '#e15e46',
  },
  {
    value: 'D',
    color: '#fea959',
  },
  {
    value: 'E',
    color: '#7e6ba3',
  },
  {
    value: 'F',
    color: '#858288',
  },
];

export const allDroughtRegimes = () => DROUGHTS;
const NUMBER_OF_MONTHS = [
  {
    value: '01',
    months: [1],
  },
  {
    value: '02',
    months: [1, 3],
  },
  {
    value: '03',
    months: [4, 5],
  },
  {
    value: '04',
    months: [6, 7],
  },
  {
    value: '05',
    months: [8, 9],
  },
  {
    value: '06',
    months: [10, 11],
  },
  {
    value: '07',
    months: [12],
  },
];
const DROUGHTS_OBJ = utils.arrToObj(DROUGHTS);

const dt = (type, key) => (
  i18n.t(`atlas:drought.${type}.${key}`)
);

export const droughtRegime = (type) => dt(type, 'regime');
export const droughtFullRegime = (type) => dt(type, 'regime_full');
export const droughtRegimeSingle = (type) => dt(type, 'regime_single');

export const colorByValue = (value) => DROUGHTS_OBJ[value].color;
export const circleColor = ({ properties: { colours } }) => (
  colorByValue(colours)
);

export const sizesForRange = (range) => {
  const f = ({ months }) => utils.inRange(months, range);
  return NUMBER_OF_MONTHS.filter(f);
};

const NB_MONTHS_OBJ = utils.arrToObj(NUMBER_OF_MONTHS);
export const getDroughtMonths = (size) => NB_MONTHS_OBJ[size].months;
export const circleMonths = ({ properties: { size_ } }) => (
  NB_MONTHS_OBJ[size_].months
);

export const monthsDescription = (size) => (
  i18n.t(`atlas:drought.monthDescription.${size}`)
);
