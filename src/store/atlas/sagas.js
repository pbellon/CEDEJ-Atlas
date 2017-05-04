import { take, put, call, fork } from 'redux-saga/effects'
import * as actions from './actions';
import carto from 'services/carto'

export function* renderMap(renderData) {
  console.log('renderMap');
  try {
    const data = yield call(carto.render, {data: renderData});
    yield put(actions.mapRenderSuccess({ data, renderData }));
  } catch (e) {
    console.log('e', e);
    yield put(actions.mapRenderFailure(e));
  }
}

export function * watchRenderMap(){
  while (true) {
    const { data } = yield take(actions.RENDER);
    yield call(renderMap, data)
  }
}

export default function* (){
  yield fork(watchRenderMap);
}
