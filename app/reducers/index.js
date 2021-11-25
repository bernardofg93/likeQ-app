import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import currentTurn from './CurrentTurn'
import user from './User'
export const rootReducer =  combineReducers({
    user,
    waitingQueue,
    currentTurn
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
