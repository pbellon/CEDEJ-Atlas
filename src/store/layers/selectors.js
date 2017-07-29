const NAMES = {
  TEMPS: 'temperatures',
  CIRCLES: 'circles'
};

export const initialState = {
  temperatures: {
    name: NAMES.TEMPS,
    visible: true
  }, 
  circles: {
    name: NAMES.CIRCLES,
    visible: true
  }
}
export const isLayerVisible = (state = initialState, layer)=>(
  layerByName(state, layer.name).visible
);
export const layerByName = (state = initialState, name)=>(
  state[name]
);

export const temperatures = (state = initialState)=>{
  console.log('layers.temperatures()', state, initialState);
  return state.temperatures;
};


export const circles = (state = initialState)=>(
  layerByName(state, NAMES.CIRCLES)
);
