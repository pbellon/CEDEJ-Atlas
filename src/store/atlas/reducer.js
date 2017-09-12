import { initialState } from './selectors';
import * as actions from './actions';

// const mimeType = (format='pdf')=>{
//   return format === 'png' ? 'image/png': 'application/pdf';
// };

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.HIDE_TUTORIAL: 
      return {
        ...state,
        isTutorialVisible: false,
      };
    case actions.CANVAS_RENDERED:
      return {
        ...state,
        canvasURL: action.url,
      };
    case actions.RENDER_DOWNLOADABLE:
      return {
        ...state,
        isRenderingDownloading: true,
        renderData: action.renderData,
      };
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
    case actions.DOWNLOAD_MAP:
      return {
        ...state,
        isRendering: false,
        isDownloading: true,
        url: action.url,
        format: action.format,
      };
    case actions.DOWNLOAD_MAP_SUCCESS:
      return {
        ...state,
        isRendering: false,
        isDownloading: false,
        data: action.data,
      };
    case actions.DOWNLOAD_MAP_FAIL:
      return {
        ...state,
        isRendering: false,
        isDownloading: false,
        error: action.error,
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
