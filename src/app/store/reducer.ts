import { createReducer, on } from '@ngrx/store';
import { addCount, loginAction, resetCount, subtractCount } from './actions';

export interface CounterState {
  count: number;
  login: boolean;
}

export const defaultState: CounterState = {
  count: 0,
  login: false,
};

export const counterReducer = createReducer(
  defaultState,
  on(addCount, (state) => ({ ...state, count: state.count + 1 })),
  on(subtractCount, (state) => ({ ...state, count: state.count - 1 })),
  on(resetCount, (state) => ({ ...defaultState })),
  on(loginAction, (state, { userName, password }) => {
    if (userName === 'Sample' && password === 'password') {
      return { ...state, login: true };
    } else {
      return { ...state, login: false };
    }
  })
);

// export const loginReducer = createReducer(
//   defaultState,
//   on(loginAction, (state, { userName, password }) => {
//     if (userName === 'Sample' && password === 'password') {
//       return { ...state, login: true };
//     } else {
//       return { ...state, login: false };
//     }
//   })
// );
