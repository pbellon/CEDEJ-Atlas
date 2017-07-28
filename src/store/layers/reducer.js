import * as actions from './actions';
import { layerByName, initialState } from './selectors';

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.TOGGLE_LAYER_VISIBILITY:
      const layer = action.layer;
      state = {
        ...state,
        [layer.name]: {
          ...layer,
          visible: !state[layer.name].visible
        }
      };
      break;
  }
  return state;
}

export default reducer;
