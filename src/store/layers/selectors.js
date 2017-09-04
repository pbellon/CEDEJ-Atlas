const NAMES = {
  TEMPS: 'temperatures',
  CIRCLES: 'circles',
};

export const initialState = {
  temperatures: {
    name: NAMES.TEMPS,
    visible: true,
  },
  circles: {
    name: NAMES.CIRCLES,
    visible: true,
  },
};

export const layerByName = (state = initialState, name) => state[name];
export const isLayerVisible = (state = initialState, layer) => layerByName(state, layer.name).visible;
export const temperatures = (state = initialState) => state.temperatures;
export const circles = (state = initialState) => (
  layerByName(state, NAMES.CIRCLES)
);

export const layers = (state)=>state;
