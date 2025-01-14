export const initialState = {
  modalOpened: false,
  mapRef: null,
  previewing: false,
  mapPreview: null,
  exporting: false,
  renderingDownloadable: false,
};

export const mapReference = (state) => state.mapRef;
export const mapPreview = (state) => state.preview;
export const isPreviewing = (state) => state.previewing;
export const isRenderingDownloadable = (state) => state.renderingDownloadable;
export const isModalOpened = (state) => state.modalOpened;
