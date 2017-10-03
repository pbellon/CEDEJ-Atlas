import { initialState } from './selectors';
import * as actions from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
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
      return {
        ...state,
        previewing: false,
        error: action.error,
      };
    case actions.RENDER_DOWNLOADABLE:
      return {
        ...state,
        renderingDownloadable: true,
      };
    case actions.RENDER_DOWNLOADABLE_SUCCES:
      return {
        ...state,
        renderingDownloadable: false,
      };
    case actions.RENDER_DOWNLOADABLE_FAILURE:
      return {
        ...state,
        error: action.error,
        renderingDownloadable: false,
      };
    case actions.DOWNLOAD_MAP_SUCCESS:
      return {
        ...state,
        renderingDownloadable: false,
      };
    case actions.DOWNLOAD_MAP_FAIL:
      return {
        ...state,
        renderingDownloadable: false,
        error: action.error,
      };
    default: return state;
  }
};
