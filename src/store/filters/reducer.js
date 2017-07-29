import * as actions from './actions';
import { DATA_LOAD_SUCCESS } from '../data/actions';
import { initialState } from './selectors';

import { fromData } from 'store/selectors';
// fake filter for the moment.
const filterCircles = (filters)=>{
  return (circle)=>true;
};


const filterTemperatures = ({temperatures})=>{
  return (t)=>true
};

const filterAridity = ({aridity})=>{
  const visibleAridityTypes = Object.keys(aridity)
    .filter(function(type){ return aridity[type].visible; });
  return (aridity)=>visibleAridityTypes.indexOf(aridity.properties.d_TYPE) > -1;
}

const filterData = (filters)=>{
  const data = filters.original;
  if(!data){ return null } else {
    return {
      aridity: data.aridity.filter(filterAridity(filters)),
      circles: data.circles.filter(filterCircles(filters)),
      temperatures: data.temperatures.filter(filterTemperatures(filters)) 
    }
  }
} 


const reducer = (state = initialState, action)=>{
  switch(action.type){
    case DATA_LOAD_SUCCESS:
      state = {
        ...state,
        original: action.data,
        filtered: action.data
      }
      break;
    case actions.UPDATE_TEMPERATURE_RANGE:
      state = {
        ...state,
        temperatures: {
          ...state.temperatures,
          [action.temperature.name]:{
            ...action.temperature,
            range:action.range
          }
        }
      };
      state.filtered = filterData(state);
      break;
    case actions.TOGGLE_ARIDITY_VISIBILITY:
      state = {
        ...state,
        aridity: {
          ...state.aridity,
          [action.aridity.name]:{
            ...action.aridity,
            visible: !state.aridity[action.aridity.name].visible
          }
        }
      };
      state.filtered = filterData(state);
      break;
    case actions.UPDATE_DRY_MONTHS_RANGE:
      state = {
        ...state,
        circles: {
          ...state.circles,
          month_range: action.range
        }
      };
      break;
  }
  return state;
}

export const data = (state)=>state.filtered;

export default reducer;
