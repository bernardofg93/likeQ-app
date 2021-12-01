import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import currentTurn from './CurrentTurn'
import user from './User'
import fcmToken from './FcmToken'
import currentDocId from './CurrentDocId'
export const rootReducer =  combineReducers({
    fcmToken,
    user,
    waitingQueue,
    currentTurn,
    currentDocId
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
