export const initialState = {
  opened: true,
  showMoreInfos: false,
};
export const isOpened = (state = initialState) => state.opened;

export const moreInfosVisible = (state) => state.showMoreInfos;
