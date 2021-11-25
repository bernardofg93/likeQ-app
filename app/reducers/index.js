import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import currentTurn from './CurrentTurn'
import user from './User'
import fcmToken from './FcmToken'
export const rootReducer =  combineReducers({
    fcmToken,
    user,
    waitingQueue,
    currentTurn
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
