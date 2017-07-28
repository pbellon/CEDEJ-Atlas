export const FILTERS_TEMPS_WINTER = 'FILTERS/TEMPERATURES/WINTER';
export const FILTERS_TEMPS_SUMMER = 'FILTERS/TEMPERATURES/SUMMER';

export const TOGGLE_ARIDITY_VISIBILITY = 'FILTERS/ARIDITY/TOGGLE';

export const filterWinterTemperatures = (range)=>({
  type: FILTERS_TEMPS_WINTER,
  range
});

export const filterSummerTemperatures = (range)=>({
  type: FILTERS_TEMPS_SUMMER,
  range
});

export const toggleAridityVisibility = (aridity)=>({
  type: TOGGLE_ARIDITY_VISIBILITY,
  aridity
});

