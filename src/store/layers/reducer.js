import * as actions from './actions';
import { initialState } from './selectors';

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_LAYER_VISIBILITY:
      return {
        ...state,
        [action.layer.name]: {
          ...action.layer,
          visible: !state[action.layer.name].visible,
        },
      };
    default:
      return state;
  }
};
