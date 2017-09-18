import * as actions from './actions';
import * as temperaturesTypes from 'utils/temperatures';
import * as circlesTypes from 'utils/circles';

import { DATA_LOAD_SUCCESS } from '../data/actions';
import { initialState } from './selectors';

const filterTemperatures = (original, temperatures) => {
  const types = temperaturesTypes.filter(temperatures).map(t => `${t.value}`);
  console.log('visible types', types);
  const f = t => types.indexOf(t.properties.Temperatur) > -1;
  return original.temperatures.features.filter(f);
};

const filterAridity = (original, aridity) => {
  const types = Object.keys(aridity)
    .filter(type => aridity[type].visible);
  const f = aridity => types.indexOf(aridity.properties.d_TYPE) > -1;
  return original.aridity.features.filter(f);
};

const filterCircles = (original, { month_range, types }) => {
  const sizes = circlesTypes.sizesForRange(month_range).map(s => s.value);
  const f = (circle) => sizes.indexOf(circle.properties.size_) > -1;
  return original.circles.features.filter(f);
};


const toggleTemperatureTypeVisibility = (state, action) => {
  console.log('filters.reducer.toggleTemperatureTypeVisibility', action);
  const temperatures = {
    ...state.temperatures,
    [action.temperature]:{
      ...state.temperatures[action.temperature],
      [action.temperatureType.name]:{
        ...action.temperatureType,
        visible:!action.temperatureType.visible
      }
    }
  };
  const nbFeaturesBefore = state.filtered.temperatures.features.length;
  const filteredFeatures = filterTemperatures(state.original, temperatures);

  console.log('before', nbFeaturesBefore, 'after', filterTemperatures.length);
  return {
    ...state,
    temperatures,
    filtered: {
      ...state.filtered,
      temperatures: {
        ...state.original.temperatures,
        features: filteredFeatures,
      }
    }
  }
};

const toggleAridityVisibility = (state, action) => {
  const aridity = {
    ...state.aridity,
    [action.aridity.name]: {
      ...action.aridity,
      visible: !state.aridity[action.aridity.name].visible,
    },
  };
  
  return {
    ...state,
    aridity,
    filtered: {
      ...state.filtered,
      aridity: {
        ...state.original.aridity,
        features: filterAridity(state.original, aridity),
      }
    },
  };
};

const updateDryMonthsRange = (state, action) => {
  const _circles = {
    ...state.circles,
    month_range: action.range,
  };

  return {
    ...state,
    circles: _circles,
    filtered: {
      ...state.filtered,
      circles: {
        ...state.original.circles,
        features: filterCircles(state.original, _circles),
      }
    },
  };
};

const toggleCircleTypeVisibility = (state, action) => {
  const circle = state.circles.types[action.circle.name];
  const circles = {
    ...state.circles,
    types: {
      ...state.circles.types,
      [circle.name]: {
        ...circle,
        visible: !circle.visible,
      },
    },
  };

  return {
    ...state,
    circles
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DATA_LOAD_SUCCESS:
      return {
        ...state,
        original: action.data,
        filtered: action.data,
      };
    case actions.TOGGLE_TEMPERATURE_TYPE_VISIBILITY:
      return toggleTemperatureTypeVisibility(state, action);
    case actions.TOGGLE_ARIDITY_VISIBILITY:
      return toggleAridityVisibility(state, action);
    case actions.UPDATE_DRY_MONTHS_RANGE:
      return updateDryMonthsRange(state, action);
    case actions.TOGGLE_CIRCLE_TYPE_VISIBILITY:
      return toggleCircleTypeVisibility(state, action);
    default:
      return state;
  }
};
