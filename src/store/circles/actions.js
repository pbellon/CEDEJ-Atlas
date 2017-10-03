export const SET_CIRCLE_SIZES_REFS = 'CIRCLES/SET_REFS';
export const ON_ADD = 'CIRCLES/ON_ADD';

export const onAdd = (refs) => ({ type: ON_ADD, refs });

export const setCircleSizesRefs = (refs) => {
  return {
    type: SET_CIRCLE_SIZES_REFS,
    refs,
  };
};
