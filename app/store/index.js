import {createStore, Store} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {rootReducer as reducers} from '../reducers';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
    key: 'like-q-app-persist',
    storage: AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };