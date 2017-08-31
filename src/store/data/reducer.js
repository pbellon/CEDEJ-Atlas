import * as actions from './actions';
import { initialState } from './selectors';

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.DATA_LOAD:
      return {
        ...state,
        isLoading: true,
      };

    case actions.DATA_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case actions.DATA_LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default: return state;
  }
};
