import { put, fork, call, take } from 'redux-saga/effects';
import { turfizeGeoJSON } from 'utils/data';
import api from 'services/api';
import * as actions from './actions';

// import simplify from '@turf/simplify';
// const simplifyPolygon = (feature) => (
//  simplify(feature, 0.001)
// );

export function* loadData() {
  try {
    const {
      aridity,
      temperatures,
      circles,
      deserts,
    } = yield call(api.getMapData);
    
    aridity.features = aridity.features
      .filter(a => a.properties.d_TYPE != null);

    circles.features = circles.features
      .filter(c => c.properties.size_ != null && c.properties.colours != null);

    temperatures.features = temperatures.features
      .filter(t => parseInt(t.properties.Temperatur, 10) > 0);

    const dataToTurfize = {
      aridity,
      temperatures,
      circles,
    };
    
    Object.keys(dataToTurfize).forEach(i => {
      turfizeGeoJSON(dataToTurfize[i].features);
    });

    const data = {
      ...dataToTurfize,
      deserts,
    };

    yield put(actions.loadSuccess(data));
  } catch (e) {
    console.error('Data loading failed', e);
    yield put(actions.loadFailure(e));
  }
}

function * runSagas(data, worker){
  yield call(loadData, data);
}

export function* watchLoadData() {
  while (true) {
    const data = yield take(actions.DATA_LOAD);
    yield call(loadData, data);
  }
}


export default function* () {
  yield fork(watchLoadData);
}
