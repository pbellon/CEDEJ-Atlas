import { take, put, call, fork } from 'redux-saga/effects';
import carto from 'services/carto';
import * as actions from './actions';

export function* previewMap({mapReference}){
  try {
    const data = yield call(carto.preview, mapReference);
    yield put(actions.previewDone(data));
  } catch(e) {
    yield put(actions.previewFail(e));
}
}

export function* watchPreviewMap(){
  while (true) {
    const data = yield take(actions.PREVIEW_EXPORT);
    yield call(previewMap, data);
  }
}


export default function* (){
  yield fork(watchPreviewMap);
}
