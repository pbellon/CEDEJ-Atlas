export const SET_CIRCLE_SIZES_REFS = 'CIRCLES/SET_REFS'; 


export const setCircleSizesRefs = (refs)=>{
  return {
    type: SET_CIRCLE_SIZES_REFS,
    circlesSizes: refs
  };
};
