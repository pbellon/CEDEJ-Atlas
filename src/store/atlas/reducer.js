import { initialState } from './selectors';
import * as actions from './actions';

// const mimeType = (format='pdf')=>{
//   return format === 'png' ? 'image/png': 'application/pdf';
// };

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RENDER:
      return {
        ...state,
        isRendering: true,
      };
    case actions.RENDER_SUCCESS:
      return {
        ...state,
        isRendering: false,
      };
    case actions.RENDER_FAIL:
      return {
        ...state,
        isRendering: false,
        renderingError: action.error,
      };

    case actions.SHOW_CONTEXTUAL_INFO:
      return {
        ...state,
        isContextualInfoVisible: true,
        contextualInfo: action.data,
      };

    case actions.HIDE_CONTEXTUAL_INFO:
      return {
        ...state,
        isContextualInfoVisible: false,
      };
    default:
      return state;
  }
};
