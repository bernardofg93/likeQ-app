import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useSelector } from "react-redux"
import waitingQueue from './WaitingQueue'
import currentTurn from './CurrentTurn'
import user from './User'
import fcmToken from './FcmToken'
import currentDocId from './CurrentDocId'
import myTurn from './MyTurn'
export const rootReducer =  combineReducers({
    isAdmin: true,
    myTurn,
    fcmToken,
    user,
    waitingQueue,
    currentTurn,
    currentDocId
});
// export type RootState = ReturnType<typeof rootReducer>;
// export const useTypedSelector = useSelector;
