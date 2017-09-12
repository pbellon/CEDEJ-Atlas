export const initialState = {
  isRendering: true,
  isContextualInfoVisible: false,
  contextualInfo: null,
  isTutorialVisible: true,
};

export const isTutorialVisible = state => state.isTutorialVisible; 
export const contextualInfo = state => state.contextualInfo;
export const isContextualInfoVisible = state => state.isContextualInfoVisible;
export const isRendering = state => state.isRendering;
export const format = state => state.renderData.format;
