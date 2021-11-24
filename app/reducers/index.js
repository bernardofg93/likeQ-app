import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import actualTurn from './ActualTurn'
export const rootReducer =  combineReducers({
    waitingQueue,
    actualTurn
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
