import { initialState } from './selectors';
import * as actions from './actions';

// const mimeType = (format='pdf')=>{
//   return format === 'png' ? 'image/png': 'application/pdf';
// };

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CANVAS_RENDERED:
      return {
        ...state,
        canvasURL: action.url,
      };
    case actions.RENDER:
      return {
        ...state,
        isRendering: true,
        renderData: action.renderData,
      };
    case actions.RENDER_FAIL:
      return {
        ...state,
        isRendering: false,
        renderingError: action.error,
      };
    case actions.DOWNLOAD_DATA:
      return {
        ...state,
        isDownloadingData: true
      };
    case actions.DOWNLOAD_DATA_SUCCESS:
      return {
        ...state,
        mapData: action.data,
        isDownloadingData: false,
      };
    case actions.DOWNLOAD_DATA_FAILURE:
      return {
        ...state,
        error: actions.error,
        isDownloadingData: false
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
    case actions.DOWNLOAD_DATA_FAIL:
      return {
        ...state,
        isRendering: false,
        isDownloading: false,
        error: action.error
      };
    default:
      return state;
  }
};
