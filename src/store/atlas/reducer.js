import { format, initialState } from './selectors'
import * as actions from './actions'
const mimeType = (format='pdf')=>{
  return format === 'png' ? 'image/png': 'application/pdf';
}
export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CANVAS_RENDER:
      return {
        ...state,
        canvasURL: action.data
      }
    case actions.RENDER:
      return {
        ...state,
        canvasURL: action.canvasURL,
        isRendering: true,
        renderData: action.renderData
      };
    case actions.RENDER_SUCCESS:
      const url = URL.createObjectURL(action.data);
      return {
        ...state,
        isRendering: false,
        fileURL: url
      };
    case actions.RENDER_FAIL:
      return {
        ...state,
        isRendering: false,
        renderingError: action.error
      }
    default:
      return state;
  }
}
