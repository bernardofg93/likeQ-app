import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import adminScreenStyles from '../styles/adminScreenStyle';
import { WaitingQueueComponent } from './WaitingQueueComponent';

export const AdminScreen = () => {

    const [currentTurn, setCurrentTurn] = useState(44);
    const [titleButton, setTitleButton] = useState('Llamar Turno');
    const [waitTurn, setWaitTurn] = useState(1);
    const [label, setLabel] = useState('Turnos en espera');


    const callTurn = () => {
        let newTurn = waitTurn - 1;
        if(waitTurn === 0){
            showValidationAlert();
        } else {
            setWaitTurn(newTurn);
            updateCurrentTurn();
        }
    }

    const updateCurrentTurn = () => {
        let turn = currentTurn + 1;
        setCurrentTurn(turn);
    }

    const showValidationAlert = () => {
        Alert.alert(
            'Atencion',
            'La fila esta vacia.',
            [
                {
                    text: 'Ok'
                }
            ],

        )     
    }

    return (
        <>
            <ScrollView style={adminScreenStyles.scroll}>
                <View style={adminScreenStyles.content}>
                    <WaitingQueueComponent
                        label = {label}
                        waitTurn = {waitTurn}
                        styleBox = {adminScreenStyles.boxTurn}
                        styleTitle = {adminScreenStyles.titleTurn}
                        styleNumber = {adminScreenStyles.numberTurn}
                    />
                    <View style={adminScreenStyles.boxTurn}>
                        <Text style={adminScreenStyles.titleTurn}>
                            Turno Actual
                        </Text>
                        <Text style={adminScreenStyles.numberTurn}>
                            {currentTurn ? currentTurn : '- -'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={adminScreenStyles.callTurn}
                        onPress={callTurn}
                    >
                        <Text style={adminScreenStyles.callTurnTxt}>
                            {titleButton}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}