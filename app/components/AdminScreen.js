import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import adminScreenStyles from '../styles/adminScreenStyle';
import { WaitingQueueComponent } from './WaitingQueueComponent';

export const AdminScreen = () => {
    const [titleButton, setTitleButton] = useState('Llamar Turno');
    const {currentTurn, waitingQueue} = useSelector(({waitingQueue,currentTurn}) => {
        return {
            waitingQueue,
            currentTurn
        }
    })
    const dispatch = useDispatch()
    const [label, setLabel] = useState('Turnos en espera');


    const callTurn = () => {
        if(currentTurn >= waitingQueue){
            showValidationAlert();
        } else {
            updateCurrentTurn();
        }
    }

    const updateCurrentTurn = () => {
        dispatch({
            type: 'TO_DISCOUNT_A_WAITING_QUEUE'
        })
        dispatch({
            type: 'INCREASE_CURRENT_TURN'
        })
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
                        waitTurn = {waitingQueue}
                        styleBox = {adminScreenStyles.boxTurn}
                        styleTitle = {adminScreenStyles.titleTurn}
                        styleNumber = {adminScreenStyles.numberTurn}
                    />
                    <View style={adminScreenStyles.boxTurn}>
                        <Text style={adminScreenStyles.titleTurn}>
                            Turno Actual
                        </Text>
                        <Text style={adminScreenStyles.numberTurn}>
                            {currentTurn}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={adminScreenStyles.callTurn}
                        onPress={callTurn}
                        disabled={currentTurn >= waitingQueue}
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