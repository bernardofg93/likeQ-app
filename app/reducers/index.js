import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
export const rootReducer =  combineReducers({
    waitingQueue
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
