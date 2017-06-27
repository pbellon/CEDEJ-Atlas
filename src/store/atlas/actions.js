export const RENDER = 'map/render';
export const RENDER_SUCCESS = 'map/render/success';
export const RENDER_FAIL = 'map/render/fail';
export const DOWNLOAD_MAP = 'map/download';
export const DOWNLOAD_MAP_SUCCESS = 'map/download/success';
export const DOWNLOAD_MAP_FAIL = 'map/download/fail';

export const DOWNLOAD_DATA = 'map/data/download';
export const DOWNLOAD_DATA_SUCCESS = 'map/data/download/success';
export const DOWNLOAD_DATA_FAIL = 'map/data/download/fail';

export const CANVAS_RENDERED = 'canvas/rendered';

export const canvasRendered = (url) => {
  return {
    type: CANVAS_RENDERED,
    url,
  };
};

export const createRenderMapRequest = (data, resolve, reject) => {
  return {
    type: RENDER,
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

export function downloadMapData(){
  return { type: DOWNLOAD_DATA  };
}


export function dataDownloadSuccess(data){
  return {
    type: DOWNLOAD_DATA_SUCCESS,
    data,
  }
}

export function dataDownloadFailure(error){
  return {
    type: DOWNLOAD_DATA_FAIL,
    error,
  }
}


export function downloadMap(data, resolve, reject) {
  console.log('actions.downloadMap', data);
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
