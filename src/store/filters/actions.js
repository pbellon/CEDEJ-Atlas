export const TOGGLE_ARIDITY_VISIBILITY = 'FILTERS/ARIDITY/TOGGLE';
export const TOGGLE_CIRCLE_SIZE_VISIBILITY = 'FILTERS/CIRCLES/SIZES/TOGGLE';
export const TOGGLE_CIRCLE_TYPE_VISIBILITY = 'FILTERS/CIRCLES/TYPES/TOGGLE';
export const TOGGLE_TEMPERATURE_TYPE_VISIBILITY = 'FILTERS/TEMPERATURES/TOGGLE';

export const toggleTemperatureVisibility = (temperature, type) => ({
  type: TOGGLE_TEMPERATURE_TYPE_VISIBILITY,
  temperature,
  temperatureType: type,
});

export const toggleAridityVisibility = (aridity) => ({
  type: TOGGLE_ARIDITY_VISIBILITY,
  aridity,
});

export const toggleCircleSizeVisibility = (circleSize) => ({
  type: TOGGLE_CIRCLE_SIZE_VISIBILITY,
  circleSize,
});

export const toggleCircleTypeVisibility = (circleType) => ({
  type: TOGGLE_CIRCLE_TYPE_VISIBILITY,
  circleType,
});
