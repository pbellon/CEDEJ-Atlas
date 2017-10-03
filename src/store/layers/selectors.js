const NAMES = {
  TEMPS: 'temperatures',
  CIRCLES: 'circles',
  ARIDITY: 'aridity',
};

export const initialState = {
  aridity: {
    name: NAMES.ARIDITY,
    visible: true,
  },
  temperatures: {
    name: NAMES.TEMPS,
    visible: true,
  },
  circles: {
    name: NAMES.CIRCLES,
    visible: true,
  },
};

export const layers = (state) => state;
export const layerByName = (state = initialState, name) => state[name];
export const isLayerVisible = (state = initialState, layer) => layerByName(state, layer.name).visible;
export const aridity = (state = initialState) => state.aridity;
export const temperatures = (state = initialState) => state.temperatures;
export const circles = (state = initialState) => (
  layerByName(state, NAMES.CIRCLES)
);
