// TODO: prévoir i18n
const ARIDITY = {
   Hyper: {
    name: 'Hyper Aride',
    precipitations: 'moins de 0,03',
   },
   Aride: {
    name: 'Aride',
    precipitations: 'de 0,03 à 0,20',
   },
   Semi: {
    name: 'Semi-Aride',
    precipitations: 'de 0,20 à 0,50',
  },
  Sub_humide: {
    name: 'Sub-humide',
    precipitations: 'de 0,50 à 0,75', 
  },
};

export const getInfos = (aridity)=>ARIDITY[aridity.name || aridity];

export const getName = (aridity)=>getInfos(aridity).name;
export const getPrecipitations = (aridity)=>getInfos(aridity).precipitations;
