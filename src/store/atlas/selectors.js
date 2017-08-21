export const initialState = {
  isRendering: true
};

export const isRendering = (state=initalState)=>state.isRendering;

export const format = (state) => {
  return state.renderData.format;
};
