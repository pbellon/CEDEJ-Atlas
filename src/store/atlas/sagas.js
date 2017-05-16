import { take, put, call, fork } from 'redux-saga/effects';
import carto from 'services/carto';
import * as actions from './actions';

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

export function* watchRenderMap() {
  while (true) {
    const { format } = yield take(actions.RENDER);
    yield call(renderMap, { format });
  }
}


export function* watchDownload() {
  while (true) {
    const data = yield take(actions.DOWNLOAD);
    yield call(downloadMap, data);
  }
}

export default function* () {
  yield fork(watchRenderMap);
  yield fork(watchDownload);
}
