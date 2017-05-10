import { format, initialState } from './selectors'
import * as actions from './actions'
const mimeType = (format='pdf')=>{
  return format === 'png' ? 'image/png': 'application/pdf';
}
export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CANVAS_RENDERED:
      return {
        ...state,
        canvasURL: action.url
      }
    case actions.RENDER:
      return {
        ...state,
        isRendering: true,
        renderData: action.renderData
      };
    case actions.RENDER_FAIL:
      return {
        ...state,
        isRendering: false,
        renderingError: action.error
      };
    case actions.DOWNLOAD:
      console.log('DOWNLOAD !',action);
      return {
        ...state,
        isRendering:false,
        url:action.url,
        format: action.format
      };
    default:
      return state;
  }
}
