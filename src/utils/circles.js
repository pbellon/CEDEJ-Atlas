import * as utils from 'utils';

const DROUGHTS = [
  {
    value: 'A',
    regime: 'régimes à pluie d\'hiver (parfois décalées vers le printemps)',
    help_regime: 'la sécheresse est maxiamle en été',
    color: '#468fba',
  },
  {
    value: 'B',
    regime: 'régimes à deux saisons de pluies',
    help_regime: `l'une vers la fin de l'automne, l'autre au 
      début du printemps: la sécheresse d'hiver est moins 
      marquée et plus courte que celle d'été.`,
    color: '#498b45',
  },
  {
    value: 'C',
    regime: 'régimes à pluies d\'été (parfois décalées vers l\'automne)',
    help_regime: 'la sécheresse est maximale en hiver',
    color: '#e15e46',
  },
  {
    value: 'D',
    regime: 'régimes à deux saisons de pluies',
    help_regime: `l'une vers la fin du printemps, l'autre au début de 
      l'automne: la sécheresse d'été est moins marquée et plus courte 
      que celle d'hiver.`,
    color: '#fea959',
  },
  {
    value: 'E',
    regime: 'régimes à deux saisons de pluies',
    help_regime: `l'une en été, l'autre en hiver: les sécheresses,
      bien marquées, sont au printemps et en automne.`,
    color: '#7e6ba3',
  },
  {
    value: 'F',
    regime: 'régimes irréguliers',
    help_regime: `les pluies sont soit accidentelles et sans date
      prévisible, soit, dans les régions moins sèches, réparties
      au long de l'année sans maximum bien marqué, ou avec des 
      maximums sans date prévisible`,
    color: '#858288',
  },
];

const DROUGHTS_OBJ = utils.arrToObj(DROUGHTS);

export const droughtRegime = (value)=>DROUGHTS_OBJ[value].regime;
export const droughtRegimeHelp = (value)=>DROUGHTS_OBJ[value].regime_help;

export const colorByValue = (value)=>DROUGHTS_OBJ[value].color;

export const circleColor = ({ properties: { colours } }) => (
  colorByValue(colours)
);

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

export const sizesForRange = (range) => {
  const f = ({ months }) => utils.inRange(months, range);
  return NUMBER_OF_MONTHS.filter(f);
};

const NB_MONTHS_OBJ = utils.arrToObj(NUMBER_OF_MONTHS);

export const circleMonths = ({ properties: { size_ } }) => (
  NB_MONTHS_OBJ[size_].months
);
