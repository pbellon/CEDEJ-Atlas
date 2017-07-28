import { combineReducers } from 'redux';
import * as actions from './actions'; 
import { initialState } from './selectors'; 

// fake filter for the moment.
const filterCircles = (filters)=>{
  return (circle)=>true;
};


const filterTemperatures = ({temperatures})=>{
  return (t)=>true
};

const filterAridity = ({aridity})=>{
  const visibleAridityTypes = Object.keys(aridity)
    .filter(function(type){ return aridity[type]; });
  
  return (aridity)=>visibleAridityTypes.indexOf(aridity.properties.d_TYPE) > -1;
}

const filterData = (data, filters)=>{
  if(!data){ return null } else {
    return {
      aridity: data.aridity.filter(filterAridity(filters)),
      circles: data.circles.filter(filterCircles(filters)),
      temperatures: data.temperatures.filter(filterTemperatures(filters)) 
    }
  }
} 

const filters = (state = initialState, action)=>{
  
  switch(action.type){
    case actions.DATA_FILTER_TEMPS_WINTER:
      state.filters.temperatures.winter = action.range;
      break;
    case actions.DATA_FILTER_TEMPS_SUMMER:
      const range = action.range;
      state.filters.temperatures.summer = action.range;
      break;
    case actions.DATA_SHOW_ARIDITY_TYPE:
      state.filters[action.aridity] = true; 
      break;
    case actions.DATA_HIDE_ARIDITY_TYPE:
      state.filters[action.aridity] = false;
      break;
  }
  state.filtered = filterData(state.data, state.filters);
  return state;
}

const loading = (state = initialState, action)=>{
  switch (action.type) {
    case actions.DATA_LOAD:
      return {
        ...state,
        isLoading: true
      };

    case actions.DATA_LOAD_SUCCESS:
      var data = {
        aridity: action.data.aridity.features,
        temperatures: action.data.temperatures.features,
        circles: action.data.circles.features,
      };

      return {
        ...state,
        isLoading: false,
        data: data,
        filtered: data
      };
    case actions.DATA_LOAD_FAIL:
      return {
        ...state,
        isLoading:false,
        error:action.error
      };

  }
}

const reducer = (state = initialState, action)=>{
  var state = loading(state, action);
  state = filters(state, action);
  return state;
}


export default reducer; 
