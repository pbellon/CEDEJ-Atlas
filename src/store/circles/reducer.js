import { initialState } from './selectors';
import * as actions from './actions';
import * as atlasActions from '../atlas/actions';

const getSizes = ({ refs }) => {
  const sizes = {};
  if(!refs){
    return {};
  }
  Object.keys(refs).forEach(key => {
    const { leafletElement } = refs[key];
    if(key === '01'){
      const parts = leafletElement._parts[0];
      if(parts && (parts.length > 1)){
        const radius = (parts[1].x - parts[0].x) / 2;
        sizes[key] = radius;
      }
    } else {
      if(leafletElement._radius){
        sizes[key] = leafletElement._radius;
      }
    }
  });
  return sizes;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_CIRCLE_SIZES_REFS:
      return {
        ...state,
        refs: action.refs,
      };
    case actions.ON_ADD:
      return {
        ...state,
        sizes: getSizes(action),
      };
    case atlasActions.ZOOM:
      return {
        ...state,
        sizes: getSizes(state),
      };
    default: return state;
  }
};
