import * as utils from 'utils';

const DROUGHTS = [
  {
    value: 'A',
    regime_single: 'régime à pluie d\'hiver (parfois décalées vers le printemps)',
    regime: 'Régimes à pluie d\'hiver',
    regime_full: `Régimes à pluies d'hiver (parfois décalées vers le printemps) : la sécheresse est maximale en été.`,
    color: '#468fba',
  },
  {
    value: 'B',
    regime_single: 'régime à deux saisons de pluies',
    regime: 'Régimes à deux saisons de pluies',
    regime_full: `Régimes à deux saisons de pluies, l'une vers la fin de l'automne, l'autre au début du printemps : la sécheresse d'hiver est moins marquée et plus courte que celle d'été.`,
    color: '#498b45',
  },
  {
    value: 'C',
    regime_single: 'régime à pluies d\'été (parfois décalées vers l\'automne)',
    regime: 'Régimes à pluies d\'été',
    regime_full: `Régimes à pluies d'été (parfois décalées vers l'automne) : la sécheresse est maximale en hiver.`,
    color: '#e15e46',
  },
  {
    value: 'D',
    regime_single: 'régime à deux saisons de pluies',
    regime: 'Régimes à deux saisons de pluies',
    regime_full: `Régimes à deux saisons de pluies, l'une vers la fin du printemps, l'autre au début de l'automne: la sécheresse d'été est moins marquée et plus courte que celle d'hiver.`,
    color: '#fea959',
  },
  {
    value: 'E',
    regime_single: 'régime à deux saisons de pluies',
    regime: 'Régimes à deux saisons de pluies',
    regime_full: `Régimes à deux saisons de pluies, l'une en été, l'autre en hiver : les sécheresses, bien marquées, sont au printemps et en automne.`,
    color: '#7e6ba3',
  },
  {
    value: 'F',
    regime_single: 'régime irrégulier',
    regime: 'Régimes irréguliers',
    regime_full: `Régimes irréguliers : les pluies sont soit accidentelles et sans date prévisible, soit, dans les régions moins sèches réparties au long de l'année sans maximum bien marqué, ou avec des maximums sans date prévisible.`,
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

export const droughtRegime = (value)=>DROUGHTS_OBJ[value].regime;

export const droughtFullRegime = (value)=>(
  DROUGHTS_OBJ[value].regime_full
);
export const droughtRegimeHelp = (value)=>DROUGHTS_OBJ[value].regime_help;
export const droughtRegimeSingle = (value)=>DROUGHTS_OBJ[value].regime_single;

export const colorByValue = (value)=>DROUGHTS_OBJ[value].color;

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
