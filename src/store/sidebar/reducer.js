import { initialState } from './selectors';

import * as actions from './actions'; 

export default (state=initialState, action)=>{
  switch (action.type){
    case actions.TOGGLE_SIDEBAR:
      return {
        opened: !state.opened
      }
    default:
      return state;
  }
};
