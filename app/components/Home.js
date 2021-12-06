import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import homeStyles from '../styles/homeStyles';

export const Home = () => {
    const navigation = useNavigation();

    return (
        <View style={homeStyles.container}>
            <Text style={homeStyles.titleApp}> like Q </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Negocio')}
            >
                <Text>Entrar</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                onPress={() => navigation.navigate('Administrador')}
            >
                <Text>Administrador</Text>
            </TouchableOpacity> */}
        </View>
    )
}
