export const MODAL_SHOW = 'MODAL/SHOW';
export const MODAL_HIDE = 'MODAL/HIDE';

export const modalShow = (name) => ({
  type: MODAL_SHOW,
  name,
});

export const modalHide = (name) => ({
  type: MODAL_HIDE,
  name,
});
