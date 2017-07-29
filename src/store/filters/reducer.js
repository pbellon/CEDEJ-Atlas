import * as actions from './actions';
import * as temperaturesTypes from '../data/types/temperatures';
import * as circlesTypes from '../data/types/circles';
import { DATA_LOAD_SUCCESS } from '../data/actions';
import { initialState } from './selectors';

import { fromData } from 'store/selectors';

const filterTemperatures = (original, temperatures)=>{
  const types = temperaturesTypes.filter(temperatures).map(t=>`${t.value}`);
  const f = (t)=>types.indexOf(t.properties.Temperatur) > -1;
  const filtered = original.temperatures.filter(f);
  return filtered;
};

const filterAridity = (original, aridity)=>{
  const types = Object.keys(aridity)
    .filter(function(type){ return aridity[type].visible; });
  const f = (aridity)=>types.indexOf(aridity.properties.d_TYPE) > -1;
  return original.aridity.filter(f);
};

const filterCircles = (original, { month_range, types })=>{
  const sizes = circlesTypes.sizesForRange(month_range).map((s)=>s.value);
  const cTypes = Object.keys(types).filter(k=>types[k].visible);
  const f = (circle)=>{
    return (
      sizes.indexOf(circle.properties.size_) > -1
    ) && (
      cTypes.indexOf(circle.properties.colours) > -1
    );
  };
  return original.circles.filter(f);
};

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
      const temperatures = {
        ...state.temperatures,
        [action.temperature.name]:{
          ...action.temperature,
          range:action.range
        }
      };

      state = {
        ...state,
        temperatures,
        filtered: {
          ...state.filtered,
          temperatures: filterTemperatures(state.original, temperatures)
        }
      };
      break;
    case actions.TOGGLE_ARIDITY_VISIBILITY:
      const aridity = {
        ...state.aridity,
        [action.aridity.name]:{
          ...action.aridity,
          visible: !state.aridity[action.aridity.name].visible
        }
      };
      state = {
        ...state,
        aridity,
        filtered:{
          ...state.filtered,
          aridity: filterAridity(state.original, aridity)
        }
      }
      break;
    case actions.UPDATE_DRY_MONTHS_RANGE:
      const _circles = {
        ...state.circles,
        month_range: action.range
      };

      state = {
        ...state,
        circles:_circles,
        filtered: {
          ...state.filtered,
          circles: filterCircles(state.original, _circles)
        }
      }
      break;
  case actions.TOGGLE_CIRCLE_TYPE_VISIBILITY:
    const circle = state.circles.types[action.circle.name];
    const circles = {
      ...state.circles,
      types:{
        ...state.circles.types,
        [circle.name]:{
          ...circle,
          visible: !circle.visible
        }
      }
    };
    state = {
      ...state,
      circles,
      filtered: {
        ...state.filtered,
        circles: filterCircles(state.original, circles)
      }
    };
    break;
  }
  return state;
}

export const data = (state)=>state.filtered;

export default reducer;
