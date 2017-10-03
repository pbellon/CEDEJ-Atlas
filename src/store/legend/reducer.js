import { initialState } from './selectors';

import * as actions from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_LEGEND:
      return {
        ...state,
        opened: !state.opened,
      };
    case actions.SHOW_MORE_INFOS:
      return {
        ...state,
        showMoreInfos: true,
      };
    case actions.HIDE_MORE_INFOS:
      return {
        ...state,
        showMoreInfos: false,
      };
    default:
      return state;
  }
};
