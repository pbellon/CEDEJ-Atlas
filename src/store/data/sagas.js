import { put, fork, call, take } from 'redux-saga/effects';
import { turfizeGeoJSON } from 'utils';
import api from 'services/api';

import * as actions from './actions';

export function* loadData(){
  try {
    const { aridity, temperatures, circles } = yield call(api.getMapData);
    const aridityFeatures = aridity.features
      .filter((a)=>a.properties.d_TYPE != null);

    const circlesFeatures = circles.features
      .filter((c)=>c.properties.size_ != null && c.properties.colours != null);
    const temperaturesFeatures = temperatures.features
      .filter((t)=>parseInt(t.properties.Temperatur) > 0);

    const data = {
      aridity: aridityFeatures,
      temperatures: temperaturesFeatures,
      circles: circlesFeatures
    };
    
    for(let i in data){
      turfizeGeoJSON(data[i]);
    }

    yield put(actions.loadSuccess(data));
  } catch (e) {
    console.error("Data loading failed", e);
    yield put(actions.loadFailure(e));
  }
}

export function* watchLoadData() {
  while (true) {
    const data = yield take(actions.DATA_LOAD);
    yield call(loadData, data);
  }
}


export default function* (){
  yield fork(watchLoadData);
}
