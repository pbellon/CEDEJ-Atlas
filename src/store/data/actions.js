export const DATA_LOAD = 'DATA/LOAD';
export const DATA_LOAD_SUCCESS = 'DATA/LOAD/SUCCESS';
export const DATA_LOAD_FAIL = 'DATA/LOAD/FAIL';

export const loadData = ()=>({ type: DATA_LOAD });

export const loadSuccess = (data)=>({
  type: DATA_LOAD_SUCCESS,
  data,
});

export const loadFailure = (error)=>({
  type: DATA_LOAD_FAIL,
  error,
});
