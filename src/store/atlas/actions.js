export const RENDER = 'map/render/start';
export const RENDER_SUCCESS = 'map/render/success'; 
export const RENDER_FAIL = 'map/render/fail'; 

export const RENDER_DOWNLOADABLE = 'map/render/downloadable';
export const RENDER_DOWNLOADABLE_SUCCESS = 'map/render/downloadable/success';
export const RENDER_DOWNLOADABLE_FAIL = 'map/render/downloadable/fail';
export const DOWNLOAD_MAP = 'map/download';
export const DOWNLOAD_MAP_SUCCESS = 'map/download/success';
export const DOWNLOAD_MAP_FAIL = 'map/download/fail';

export const canvasRendered = (url) => {
  return {
    type: RENDER_DOWNLOADABLE_SUCCESS,
    url,
  };
};

export const createRenderMapRequest = (data, resolve, reject) => {
  return {
    type: RENDER_DOWNLOADABLE,
    ...data,
    resolve,
    reject,
  };
};

export function mapRenderFailure(error) {
  return {
    type: RENDER_FAIL,
    error,
  };
}
export const startRender = ()=>{
  console.log('render !');
  return {  type: RENDER }
};
export const renderSuccess = ()=>({
  type: RENDER_SUCCESS
});

export function downloadMap(data, resolve, reject) {
  return {
    type: DOWNLOAD_MAP,
    ...data,
    resolve,
    reject,
  };
}

export function mapDownloadSuccess(data) {
  return {
    type: DOWNLOAD_MAP_SUCCESS,
    ...data,
  };
}
export function mapDownloadFailure(error) {
  return {
    type: DOWNLOAD_MAP_FAIL,
    error,
  };
}
