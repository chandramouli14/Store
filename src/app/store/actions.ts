import { createAction, props } from "@ngrx/store";


//These are the actions created with the create action method it will take 
// atleast one parameter and its better to add the component name to know where that action belongs to.
export const addCount = createAction('[Counter Component] Add count')
export const subtractCount = createAction('[Counter Component] Subtract count')
export const resetCount = createAction('[Counter Component] reset count')
//action with payload
export const loginAction  = createAction('[login Component] Login With Payload', props<{userName:string, password: string}>())
