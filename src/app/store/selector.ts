import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CounterState } from './reducer';

export const counterSelector = createFeatureSelector<CounterState>('count');
export const selectCount = createSelector(
  (state: any) => state.rootState,
  (state)=>state.count
  // counterSelector,
);

export const loginSelector = createFeatureSelector<CounterState>('login');
export const loginState = createSelector(
  counterSelector,
  (state) => state.login
);

export const currentState = createSelector(
  selectCount,
  loginState,
  (count, state) => ({ count: count, state: state })
);

export const normalCountSelector = createSelector(
  (state: CounterState) => state,
  (state)=> state.count
);
