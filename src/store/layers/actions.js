export const TOGGLE_LAYER_VISIBILITY = 'LAYERS/TOGGLE';

export const toggleLayerVisibility = (layer) => ({
  type: TOGGLE_LAYER_VISIBILITY,
  layer,
});
