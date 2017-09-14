import { initialState } from './selectors';
import * as actions from './actions';

export default (state = initialState, action)=>{
  switch(action.type){
    case actions.BIND_MAP_REFERENCE:
      return {
        ...state,
        mapRef: action.mapReference,
      };
    case actions.OPEN_MODAL:
      return {
        ...state,
        modalOpened: true,
      };
    case actions.CLOSE_MODAL:
      return {
        ...state,
        modalOpened: false,
      };
    case actions.PREVIEW_EXPORT:
      return {
        ...state,
        previewing: true,
      };
    case actions.PREVIEW_DONE:
      return {
        ...state,
        preview: action.preview,
        previewing: false,
      };
    case actions.PREVIEW_FAIL:
      console.error('Map preview failed:', action.error);
      return {
        ...state,
        previewing: false,
        error: action.error,
      };
    default: return state;

  }

  return state;
}
