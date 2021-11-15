import React from 'react';
import { Text, View } from 'react-native';
import homeStyles from '../styles/homeStyles';

export const Home = () => {
    return (
        <View style={homeStyles.container}>
             <Text style={homeStyles.titleApp}> Like Q app </Text>
        </View>
    )
}
