export const DATA_LOAD = 'DATA/LOAD';
export const DATA_LOAD_SUCCESS = 'DATA/LOAD/SUCCESS';
export const DATA_LOAD_FAIL = 'DATA/LOAD/FAIL';

export const DATA_FILTER_TEMPS_WINTER = 'DATA/FILTER/TEMPERATURES/WINTER';
export const DATA_FILTER_TEMPS_SUMMER = 'DATA/FILTER/TEMPERATURES/SUMMER';

export const DATA_SHOW_ARIDITY_TYPE = 'DATA/FILTER/ARIDITY_TYPE/SHOW';
export const DATA_HIDE_ARIDITY_TYPE = 'DATA/FILTER/ARIDITY_TYPE/HIDE';

export const filterWinterTemperatures = (range)=>({
  type: DATA_FILTER_TEMPS_WINTER,
  range
});

export const filterSummerTemperatures = (range)=>({
  type: DATA_FILTER_TEMPS_SUMMER,
  range
});

export const showAridityType = (type)=>({
  type: DATA_SHOW_ARIDITY_TYPE,
  aridity: type,
});

export const hideAridityType = (type)=>({
  type: DATA_HIDE_ARIDITY_TYPE,
  aridity: type,
});


export const loadData = ()=>({ type: DATA_LOAD });

export const loadSuccess = (data)=>({
  type: DATA_LOAD_SUCCESS,
  data,
});

export const loadFailure = (error)=>({
  type: DATA_LOAD_FAIL,
  error,
});
