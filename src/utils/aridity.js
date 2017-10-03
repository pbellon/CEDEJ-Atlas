// TODO: prévoir i18n
const ARIDITY = {
  Hyper: {
    name: 'Hyper Aride',
    description: 'La zone **hyper-aride** (P/Etp moins de 0,03) correspond au désert vrai, avec possibilité d\'une ou plusieurs années sans pluies, soit sans aucune végétation, soit avec des éphémérophytes et quelques buissons dans les lits d\'oueds.',
    precipitations: 'moins de 0,03',
  },
  Aride: {
    name: 'Aride',
    description: 'La zone **aride** (P/Etp de 0,03 à 0,20) comprend des régions avec espèces épineuses ou succulentes, et végétation annuelle clairsemée; l\'élevage nomade y est praticable, mais la culture sans irrigation n\'y est généralement pas possible.',
    precipitations: 'de 0,03 à 0,20',
  },
  Semi: {
    name: 'Semi-Aride',
    description: 'La zone **semi-aride**(**P/Etp de 0,20 à 0,50**) comprend des steppes ou des formations tropicales buissonnantes sur couvert herbacé plus ou moins discontinu avec plus grande fréquence de graminées pérennes; l\'élevage sédentaire y est possible ainsi que la culture non irriguée.',
    precipitations: 'de 0,20 à 0,50',
  },
  Sub_humide: {
    description: 'La zone **sub-humide** (**P/Etp de 0,50 à 0,75**) comprend principalement certains types de savanes tropicales, des maquis et chaparrals de climat méditérranéen, ainsi que les steppes sur chernozem.',
    name: 'Sub-humide',
    precipitations: 'de 0,50 à 0,75',
  },
};

export const allAridity = () => (
  Object.keys(ARIDITY)
    .map(key => {
      const aridity = ARIDITY[key];
      return {
        ...aridity,
        value: key,
      };
    })
);

export const getInfos = (aridity) => ARIDITY[aridity.name || aridity];

export const getName = (aridity) => getInfos(aridity).name;
export const getDescription = (aridity) => getInfos(aridity).description;
export const getPrecipitations = (aridity) => getInfos(aridity).precipitations;
