import { initialState } from './selectors';
import * as actions from './actions'; 
import * as atlasActions from '../atlas/actions';

const getSizes = ({ sizeRefs })=>{
  const sizes = {};
  Object.keys(sizeRefs).forEach(key => {
    sizes[key] = sizeRefs[key].leafletElement._radius; 
  });
  return sizes;
}

const reducer = (state = initialState, action)=>{
  switch(action.type){
    case actions.SET_CIRCLE_SIZES_REFS:
      console.log('reducer.SET_CIRCLES_SIZES_REFS', action);
      state = {
        ...state,
        sizeRefs: action.circlesSizes
      };
      break;
    case atlasActions.RENDER_SUCCESS:
      state = {
        ...state,
        sizes: getSizes(state)
      };
      break;
    case atlasActions.ZOOM:
      state = {
        ...state,
        sizes: getSizes(state)
      };
      break;
  }
  return state;
};

export default reducer;
