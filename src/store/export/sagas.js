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

export function* renderMap(renderData) {
  try {
    const data = yield call(carto.render, renderData);
    yield put(actions.downloadMap(data));
  } catch (e) {
    yield put(actions.mapRenderFailure(e));
  }
}

export function* downloadMap(renderedMap) {
  try {
    const data = yield call(carto.download, renderedMap);
    yield put(actions.mapDownloadSuccess(data));
  } catch (e) {
    yield put(actions.mapDownloadFailure(e));
  }
}

export function* watchRenderDownloadableMap() {
  while (true) {
    const { format } = yield take(actions.RENDER_DOWNLOADABLE);
    yield call(renderMap, { format });
  }
}

export function* watchDownloadMap() {
  while (true) {
    const data = yield take(actions.DOWNLOAD_MAP);
    yield call(downloadMap, data);
  }
}

export default function* (){
  yield fork(watchPreviewMap);
  yield fork(watchRenderDownloadableMap);
  yield fork(watchDownloadMap);
}
