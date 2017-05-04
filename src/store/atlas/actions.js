export const RENDER = 'map/render';
export const RENDER_START = 'map/render/start';
export const RENDER_SUCCESS = 'map/render/success';
export const RENDER_FAIL = 'map/render/fail';

export const CANVAS_RENDER = 'canvas/render';

export const canvasRender = (data)=>{
  return {
    type: CANVAS_RENDER,
    data
  }
}

export const createRenderMapRequest = (data, resolve, reject)=>{
  return {
    type: RENDER,
    data,
    resolve,
    reject
  };
}


export function mapRenderSuccess({data, renderData}){
  console.log('mapRenderSuccess', data);
  return {
    type: RENDER_SUCCESS,
    data,
    renderData
  }
}

export function mapRenderFailure(error){
  return {
    type: RENDER_FAIL,
    error
  }
}
