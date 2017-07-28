import { put, fork, call, take } from 'redux-saga/effects';
import api from 'services/api';

import * as actions from './actions';

export function* loadData(){
  try {
    const data = yield call(api.getMapData);
    yield put(actions.loadSuccess(data));
  } catch (e) {
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
