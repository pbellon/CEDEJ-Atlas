import { initialState } from './selectors';

import * as actions from './actions';

export default (state = initialState, action) => {
  switch(action.type){
    case actions.HIDE_TUTORIAL:
      console.log('HIDE TUTORIAL');
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }

}
