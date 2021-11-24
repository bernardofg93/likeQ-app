import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import currentTurn from './CurrentTurn'
export const rootReducer =  combineReducers({
    waitingQueue,
    currentTurn
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
