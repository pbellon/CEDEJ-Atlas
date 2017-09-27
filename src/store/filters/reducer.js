import union from '@turf/union';
import { featureReduce } from '@turf/meta';

import * as temperaturesTypes from 'utils/temperatures';
import * as circlesTypes from 'utils/circles';

import * as actions from './actions';

import { DATA_LOAD_SUCCESS } from '../data/actions';
import { initialState } from './selectors';

const filterTemperatures = (original, temperatures) => {
  const types = temperaturesTypes.filter(temperatures).map(t => `${t.value}`);
  if(types.length > 0){
    const f = t => types.indexOf(t.properties.Temperatur) > -1;
    return original.temperatures.features.filter(f);
  } else {
    return [];
  }
};

const filterAridity = (original, aridity) => {
  const types = Object.keys(aridity)
    .filter(type => aridity[type].visible);
  if(types.length > 0){
    const f = aridity => types.indexOf(aridity.properties.d_TYPE) > -1;
    return original.aridity.features.filter(f);
  } else {
    return [];
  }
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

  if(visibleSizes.length > 0){
    let f = sizeFilter;
    if(visibleTypes.length > 0){
      f = (circle) => sizeFilter(circle) && typeFilter(circle);
    }
    return original.circles.features.filter(f);
  } else {
    return [];
  }
};

const chunkize = (arr, chunkSize=10) => {
  const len = arr.length;
  const nbChunks = Math.round(len/chunkSize);
  console.log('nbChunks', nbChunks, len);
  const res = [];
  let i = 0;
  for(i; i < nbChunks; i++){
    const j = i * chunkSize;
    res.push(arr.slice(j, j + chunkSize)); 
  }
  return res;
};

const reduceFeatures = (features) => {
  let i = 0;
  let polygon;
  const featuresChunks = chunkize(features, 37);
  const len = featuresChunks.length;
  const polygons = [];
  for(i; i < len; i++){
    polygons.push(union.apply(null, featuresChunks[i]));
  }
  return union.apply(null, polygons);
}

const featuresUnionMask = ({
  temperatures,
  aridity,
  filtered,
  ...state,
}) => {
  console.log('featuresUnionMask');
  const { winter, summer } = temperatures;
  const {
    aridity:{features:fAridity},
    temperatures:{features:fTemperatures},
  } = filtered;

  const toArr = (obj) => Object.keys(obj).map(key => obj[key]);
  const hasElems = (arr) => arr.length > 0;
  const hasFiltered = (arr) => arr.filter(el => el.visible).length !== arr.length;
  
  const winterArr = toArr(winter);
  const summerArr = toArr(summer);
  const aridityArr = toArr(aridity);

  const shouldPerform = (
    hasElems(fAridity) && hasElems(fTemperatures)
  ) && (
    hasFiltered(winterArr) || hasFiltered(summerArr) || hasFiltered(aridityArr)
  );

  let unionMask;
  
  if(shouldPerform){
    let start = (new Date()).getTime();
    const aridityUnion = reduceFeatures(fAridity);
    let elleapsed = (new Date()).getTime() - start;
    console.log('Took', elleapsed / 1000, 'seconds');
    start = (new Date()).getTime();
    const temperaturesUnion = reduceFeatures(fTemperatures);
    elleapsed = (new Date()).getTime() - start; 
    console.log('Took', elleapsed / 1000, 'seconds');
  }

  return {
    temperatures,
    aridity,
    filtered,
    unionMask,
    ...state,
  }
}
const toggleTemperatureTypeVisibility = (state, action) => {
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

  return featuresUnionMask({
    ...state,
    temperatures,
    filtered: {
      ...state.filtered,
      temperatures: {
        ...state.original.temperatures,
        features: filterTemperatures(state.original, temperatures),
      }
    }
  });
};

const toggleAridityVisibility = (state, action) => {
  const aridity = {
    ...state.aridity,
    [action.aridity.name]: {
      ...action.aridity,
      visible: !state.aridity[action.aridity.name].visible,
    },
  };
  
  return featuresUnionMask({
    ...state,
    aridity,
    filtered: {
      ...state.filtered,
      aridity: {
        ...state.original.aridity,
        features: filterAridity(state.original, aridity),
      }
    },
  });
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
      }
    }
  };

  return {
    ...state,
    circles: _circles,
    filtered: {
      ...state.filtered,
      circles: {
        ...state.filtered.circles,
        features: filterCircles(state.original, _circles)
      }
    }
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
        features: filterCircles(state.original, _circles)
      },
    },
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
    case actions.TOGGLE_CIRCLE_SIZE_VISIBILITY:
      return toggleCircleSizeVisibility(state, action);
    case actions.TOGGLE_CIRCLE_TYPE_VISIBILITY:
      return toggleCircleTypeVisibility(state, action);
    default:
      return state;
  }
};
