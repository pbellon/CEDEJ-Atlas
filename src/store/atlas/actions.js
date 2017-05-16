export const RENDER = 'map/render';
export const RENDER_SUCCESS = 'map/render/success';
export const RENDER_FAIL = 'map/render/fail';
export const DOWNLOAD = 'map/download';
export const DOWNLOAD_SUCCESS = 'map/download/success';
export const DOWNLOAD_FAIL = 'map/download/fail';

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

export function downloadMap(data, resolve, reject) {
  console.log('actions.downloadMap', data);
  return {
    type: DOWNLOAD,
    ...data,
    resolve,
    reject,
  };
}

export function mapDownloadSuccess(data) {
  return {
    type: DOWNLOAD_SUCCESS,
    ...data,
  };
}
export function mapDownloadFailure(error) {
  return {
    type: DOWNLOAD_FAIL,
    error,
  };
}
