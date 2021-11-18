import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//Components
import { ListStores } from './app/components/ListStores';
import { Home } from './app/components/Home';
import { BussinesScreen } from './app/components/BussinesScreen';

const Stack = createStackNavigator();

const App = () => {

    return (
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;