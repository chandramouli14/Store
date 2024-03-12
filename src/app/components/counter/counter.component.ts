import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addCount,
  loginAction,
  resetCount,
  subtractCount,
} from 'src/app/store/actions';
import { currentState, loginState, selectCount } from 'src/app/store/selector';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit {
  count$: any;
  login$: any;
  sample$: any;

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.count$ = this.store.select(selectCount);
    this.login$ = this.store.select(loginState);
    this.sample$ = this.store.select(currentState)
    this.store.dispatch(
      loginAction({ userName: 'Sample User', password: 'password' })
    );
  }

  increment() {
    this.store.dispatch(addCount());
    this.store.dispatch(
      loginAction({ userName: 'Sample', password: 'password' })
    );
  }

  decrement() {
    this.store.dispatch(subtractCount());
  }

  reset() {
    this.store.dispatch(resetCount());
  }
}
