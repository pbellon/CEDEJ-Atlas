export const CLOSE_MODAL = 'EXPORT/MODAL/CLOSE';
export const OPEN_MODAL = 'EXPORT/MODAL/OPEN';
export const BIND_MAP_REFERENCE = 'EXPORT/MAP/BIND_REF';
export const PREVIEW_EXPORT = 'EXPORT/PREVIEW/START';
export const PREVIEW_DONE = 'EXPORT/PREVIEW/DONE';
export const PREVIEW_FAIL = 'EXPORT/PREVIEW/FAIL';


export const RENDER_DOWNLOADABLE = 'map/render/downloadable';
export const RENDER_DOWNLOADABLE_SUCCESS = 'map/render/downloadable/success';
export const RENDER_DOWNLOADABLE_FAIL = 'map/render/downloadable/fail';

export const DOWNLOAD_MAP = 'map/download';
export const DOWNLOAD_MAP_SUCCESS = 'map/download/success';
export const DOWNLOAD_MAP_FAIL = 'map/download/fail';

export const bindMapReference = (mapReference) => ({
  type: BIND_MAP_REFERENCE,
  mapReference,
});


export const previewExport = (mapRef) => ({
  type: PREVIEW_EXPORT,
  mapReference: mapRef,
});

export const previewDone = (preview) => ({
  type: PREVIEW_DONE,
  preview,
});

export const previewFail = (error) => ({
  type: PREVIEW_FAIL,
  error,
});

export const openExportModal = () => ({ type: OPEN_MODAL });
export const closeExportModal = () => ({ type: CLOSE_MODAL });

export const renderDownloadableMapSuccess = () => {
  return {
    type: RENDER_DOWNLOADABLE_SUCCESS,
  };
};

export const renderDownloadableMap = (data, resolve, reject) => {
  return {
    type: RENDER_DOWNLOADABLE,
    ...data,
    resolve,
    reject,
  };
};

export const renderDownloadableMapFailure = (error, resolve, reject) => ({
  type: RENDER_DOWNLOADABLE_FAIL,
  error,
  resolve,
  reject,
});

export const downloadMap = (data, resolve, reject) => ({
  type: DOWNLOAD_MAP,
  ...data,
  resolve,
  reject,
});

export const mapDownloadSuccess = (data) => ({
  type: DOWNLOAD_MAP_SUCCESS,
  ...data,
});

export const mapDownloadFailure = (error) => ({
  type: DOWNLOAD_MAP_FAIL, error,
});
