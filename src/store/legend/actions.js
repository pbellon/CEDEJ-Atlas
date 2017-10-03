export const TOGGLE_LEGEND = 'LEGEND/TOGGLE';
export const SHOW_MORE_INFOS = 'LEGEND/INFOS/SHOW';
export const HIDE_MORE_INFOS = 'LEGEND/INFOS/HIDE';

export const toggleLegend = () => ({
  type: TOGGLE_LEGEND,
});

export const hideMoreInfos = () => ({
  type: HIDE_MORE_INFOS,
});

export const showMoreInfos = () => ({
  type: SHOW_MORE_INFOS,
});
