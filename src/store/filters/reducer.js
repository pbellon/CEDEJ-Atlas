import * as temperaturesTypes from 'utils/temperatures';

import * as actions from './actions';

import { DATA_LOAD_SUCCESS } from '../data/actions';
import { initialState } from './selectors';

const filterTemperatures = (original, temperatures) => {
  const types = temperaturesTypes.filter(temperatures).map(t => `${t.value}`);
  let result = [];
  if (types.length > 0) {
    const f = t => types.indexOf(t.properties.Temperatur) > -1;
    result = original.temperatures.features.filter(f);
  }
  return result;
};

const filterAridity = (original, aridity) => {
  const types = Object.keys(aridity)
    .filter(type => aridity[type].visible);
  let result = [];

  if (types.length > 0) {
    const f = aridity => types.indexOf(aridity.properties.d_TYPE) > -1;
    result = original.aridity.features.filter(f);
  }
  return result;
};

const filterCircles = (original, { sizes, types }) => {
  const visibleTypes = Object.keys(types)
    .filter(key => types[key].visible);

  const visibleSizes = Object.keys(sizes)
    .filter(key => sizes[key].visible);

  const sizeFilter = (circle) => (
    visibleSizes.indexOf(circle.properties.size_) > -1
  );

  const typeFilter = (circle) => (
    visibleTypes.indexOf(circle.properties.colours) > -1
  );
  let result = [];
  if (visibleSizes.length > 0) {
    let f = sizeFilter;
    if (visibleTypes.length > 0) {
      f = (circle) => sizeFilter(circle) && typeFilter(circle);
    }
    result = original.circles.features.filter(f);
  }

  return result;
};

const visibleTypesCount = (types) => (
  Object.keys(types).filter(key => types[key].visible).length
);

const toggleTemperatureTypeVisibility = (state, action) => {
  const temperatures = {
    ...state.temperatures,
    [action.temperature]: {
      ...state.temperatures[action.temperature],
      [action.temperatureType.name]: {
        ...action.temperatureType,
        visible: !action.temperatureType.visible,
      },
    },
  };

  const tempsCount = ({ winter, summer }) => (
    visibleTypesCount(winter) + visibleTypesCount(summer)
  );

  const counts = {
    ...state.counts,
    temperatures: {
      original: state.counts.temperatures.original,
      previous: tempsCount(state.temperatures),
      current: tempsCount(temperatures),
    },
  };
  return {
    ...state,
    temperatures,
    counts,
    filtered: {
      ...state.filtered,
      temperatures: {
        ...state.original.temperatures,
        features: filterTemperatures(state.original, temperatures),
      },
    },
  };
};

const toggleAridityVisibility = (state, action) => {
  const aridity = {
    ...state.aridity,
    [action.aridity.name]: {
      ...action.aridity,
      visible: !state.aridity[action.aridity.name].visible,
    },
  };
  const counts = {
    ...state.counts,
    aridity: {
      original: state.counts.aridity.original,
      previous: visibleTypesCount(state.aridity),
      current: visibleTypesCount(aridity),
    },
  };

  return {
    ...state,
    aridity,
    counts,
    filtered: {
      ...state.filtered,
      aridity: {
        ...state.original.aridity,
        features: filterAridity(state.original, aridity),
      },
    },
  };
};

// makes a circle size visible or not.
const toggleCircleSizeVisibility = (state, action) => {
  const size = state.circles.sizes[action.circleSize.name];

  const _circles = {
    ...state.circles,
    sizes: {
      ...state.circles.sizes,
      [size.name]: {
        ...size,
        visible: !size.visible,
      },
    },
  };

  return {
    ...state,
    circles: _circles,
    filtered: {
      ...state.filtered,
      circles: {
        ...state.filtered.circles,
        features: filterCircles(state.original, _circles),
      },
    },
  };
};

const toggleCircleTypeVisibility = (state, action) => {
  const type = state.circles.types[action.circleType.name];
  const _circles = {
    ...state.circles,
    types: {
      ...state.circles.types,
      [type.name]: {
        ...type,
        visible: !type.visible,
      },
    },
  };

  return {
    ...state,
    circles: _circles,
    filtered: {
      ...state.filtered,
      circles: {
        ...state.original.circles,
        features: filterCircles(state.original, _circles),
      },
    },
  };
};

export default (state = initialState, action) => {
  let result;
  switch (action.type) {
    case DATA_LOAD_SUCCESS:
      result = {
        ...state,
        original: action.data,
        filtered: action.data,
      };
      break;
    case actions.TOGGLE_TEMPERATURE_TYPE_VISIBILITY:
      result = toggleTemperatureTypeVisibility(state, action);
      break;
    case actions.TOGGLE_ARIDITY_VISIBILITY:
      result = toggleAridityVisibility(state, action);
      break;
    case actions.TOGGLE_CIRCLE_SIZE_VISIBILITY:
      result = toggleCircleSizeVisibility(state, action);
      break;
    case actions.TOGGLE_CIRCLE_TYPE_VISIBILITY:
      result = toggleCircleTypeVisibility(state, action);
      break;
    default:
      result = state;
      break;
  }
  return result;
};
