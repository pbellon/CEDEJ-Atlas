export const CLOSE_MODAL = 'EXPORT/MODAL/CLOSE';
export const OPEN_MODAL = 'EXPORT/MODAL/OPEN';
export const BIND_MAP_REFERENCE = 'EXPORT/MAP/BIND_REF';
export const START_EXPORT = 'EXPORT/START';

export const PREVIEW_EXPORT = 'EXPORT/PREVIEW/START';
export const PREVIEW_DONE = 'EXPORT/PREVIEW/DONE';
export const PREVIEW_FAIL = 'EXPORT/PREVIEW/FAIL';

export const bindMapReference = (mapReference)=>({
  type: BIND_MAP_REFERENCE,
  mapReference
});


export const previewExport = (mapRef)=>({
  type: PREVIEW_EXPORT,
  mapReference: mapRef,
});

export const previewDone = (preview)=>({
  type: PREVIEW_DONE,
  preview,
});

export const previewFail = (error)=>({
  type: PREVIEW_FAIL,
  error,
});

export const startExport = (exportType)=>({ type: START_EXPORT, exportType});
export const openExportModal = ()=>({ type:OPEN_MODAL });
export const closeExportModal = ()=>({ type:CLOSE_MODAL });
