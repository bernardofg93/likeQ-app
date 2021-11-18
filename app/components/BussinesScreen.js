import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import bussinesScreenStyles from '../styles/bussinesScreenStyles';

export const BussinesScreen = () => {

    const [yourTurn, setYourTurn] = useState();
    const [titleButton, setTitleButton] = useState('Pedir Turno');
    const [waitTurn, setWaitTurn] = useState(157);

    const getTurn = () => {
        let newTurn = waitTurn + 1;
        setYourTurn(newTurn);
        setTitleButton('Cancelar Turno');
        showAlert();
    }

    const showAlert = () => {
        Alert.alert(
            'Error...',
            'Hubo algun error',
            [
                {text: 'OK'}
            ]
        )
    }

    return (
        <>
            <ScrollView style={bussinesScreenStyles.scroll}>
                <View style={bussinesScreenStyles.content}>
                    <Text style={bussinesScreenStyles.titleScreen}>Este negocio tiene aproximadamente 20</Text>
                    <Text style={bussinesScreenStyles.titleScreen}>minutos de espera</Text>

                    <View style={bussinesScreenStyles.boxTurn}>
                        <Text style={bussinesScreenStyles.titleTurn}>
                            Turnos por esperar
                        </Text>
                        <Text style={bussinesScreenStyles.numberTurn}>
                            {waitTurn}
                        </Text>
                    </View>

                    <View style={bussinesScreenStyles.boxTurn}>
                        <Text style={bussinesScreenStyles.titleTurn}>
                            Tu turno
                        </Text>
                        <Text style={bussinesScreenStyles.numberTurn}>
                            {yourTurn ? yourTurn : '- -'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={bussinesScreenStyles.cancelTurn}
                        onPress={getTurn}
                    >
                        <Text style={bussinesScreenStyles.cancelTurnTxt}>
                            {titleButton}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}
