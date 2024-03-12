import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitchDemoComponent } from './components/switch-demo/switch-demo.component';
import { CustomDirectiveComponent } from './components/custom-directive/custom-directive.component';
import { CustomAttributeDirective } from './directives/custom-attribute-directive.directive';
import { PipesDemoComponent } from './components/pipes-demo/pipes-demo.component';
import { ScrollSpyDirective } from './directives/scroll-spy.directive';
import { StoreModule } from '@ngrx/store';
import { CounterComponent } from './components/counter/counter.component';
import { counterReducer } from './store/reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    AddTaskComponent,
    SwitchDemoComponent,
    CustomDirectiveComponent,
    CustomAttributeDirective,
    PipesDemoComponent,
    ScrollSpyDirective,
    CounterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // StoreModule.forRoot({ count: counterReducer, rootState: counterReducer }),
    // StoreDevtoolsModule.instrument({
    //   logOnly: true,
    // }),
  ],
  providers: [],
  bootstrap: [AppComponent, TaskListComponent],
})
export class AppModule {}
