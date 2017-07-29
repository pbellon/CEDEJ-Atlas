export const UPDATE_TEMPERATURE_RANGE = 'FILTERS/TEMPERATURES/UPDATE';
export const TOGGLE_ARIDITY_VISIBILITY = 'FILTERS/ARIDITY/TOGGLE';
export const UPDATE_DRY_MONTHS_RANGE = 'FILTERS/CIRCLES/MONTHS';


export const updateTemperatureRange = (temperature, range)=>({
  type: UPDATE_TEMPERATURE_RANGE,
  temperature,
  range
});

export const toggleAridityVisibility = (aridity)=>({
  type: TOGGLE_ARIDITY_VISIBILITY,
  aridity
});


export const updateDryMonthsRange = (range)=>({
  type: UPDATE_DRY_MONTHS_RANGE,
  range
});
