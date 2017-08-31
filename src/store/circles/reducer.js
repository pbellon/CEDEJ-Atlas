import { initialState } from './selectors';
import * as actions from './actions';
import * as atlasActions from '../atlas/actions';

const getSizes = ({ sizeRefs }) => {
  const sizes = {};
  Object.keys(sizeRefs).forEach(key => {
    sizes[key] = sizeRefs[key].leafletElement._radius;
  });
  return sizes;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_CIRCLE_SIZES_REFS:
      return {
        ...state,
        sizeRefs: action.circlesSizes,
      };
    case atlasActions.RENDER_SUCCESS:
      return {
        ...state,
        sizes: getSizes(state),
      };
    case atlasActions.ZOOM:
      return {
        ...state,
        sizes: getSizes(state),
      };
    default: return state;
  }
};
