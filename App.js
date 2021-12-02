import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {AppState} from 'react-native'
//Components
import { ListStores } from './app/components/ListStores';
import { Home } from './app/components/Home';
import { BussinesScreen } from './app/components/BussinesScreen';
import { AdminScreen } from './app/components/AdminScreen';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging'

const Stack = createStackNavigator();

const App = () => {
    React.useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            if(AppState.currentState === 'active'){
                const {data} = remoteMessage
                PushNotification.localNotificationSchedule({
                    message: data.body, // (required)
                    date: new Date(Date.now() + (1 * 1000)),
                    actions: ["ReplyInput"],
                    reply_placeholder_text: "Write your response...", // (required)
                    reply_button_text: "Reply" // (required)
                });
            }
            console.log('Push received', remoteMessage);
        });

        return unsubscribe;
    })
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: '#51cbd4'
                            },
                            headerTintColor: '#000'
                        }}
                    >
                        <Stack.Screen
                            name="Inicio"
                            component={Home}
                            options={{
                                title: ''
                            }}
                        />
                        <Stack.Screen
                            name="Negocios"
                            component={ListStores}
                            options={{
                                title:
                                    'Negocios'
                            }}
                        />
                        <Stack.Screen
                            name="Negocio"
                            component={BussinesScreen}
                            options={{
                                title:
                                    'Negocio'
                            }}
                        />
                        <Stack.Screen
                            name="Administrador"
                            component={AdminScreen}
                            options={{
                                title:
                                    'Administrador'
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
};

export default App;