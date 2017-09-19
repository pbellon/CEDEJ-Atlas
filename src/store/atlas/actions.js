export const RENDER = 'map/render/start';
export const RENDER_SUCCESS = 'map/render/success';
export const RENDER_FAIL = 'map/render/fail';


export const SHOW_CONTEXTUAL_INFO = 'map/legend/show_info';
export const HIDE_CONTEXTUAL_INFO = 'map/legend/hide_info';


export const ZOOM = 'map/zoom/end';


export const zoom = () => ({
  type: ZOOM,
});


export const startRender = () => ({ type: RENDER });

export const renderSuccess = () => ({ type: RENDER_SUCCESS });


export const showContextualInfo = (data) => ({
  type: SHOW_CONTEXTUAL_INFO,
  data,
});

export const hideContextualInfo = () => ({
  type: HIDE_CONTEXTUAL_INFO,
});

