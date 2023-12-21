import {call, put} from 'redux-saga/effects';
import {SettingsState, setSettings} from '../reducers/settings';
import * as api from '../helpers/api';

export function* getSettings() {
  try {
    const settings: SettingsState = yield call(api.getSettings);
    yield put(setSettings(settings));
  } catch (e) {
    console.warn('error fetching settings');
  }
}
