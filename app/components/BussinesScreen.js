import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import bussinesScreenStyles from '../styles/bussinesScreenStyles';
import { WaitingQueueComponent } from './WaitingQueueComponent';
import { useDispatch, useSelector } from 'react-redux';

export const BussinesScreen = () => {
    const [titleButton, setTitleButton] = useState('Pedir Turno');
    const {currentTurn, waitingQueue} = useSelector(({waitingQueue,currentTurn}) => {
        return {
            waitingQueue,
            currentTurn
        }
    })
    const dispatch = useDispatch()
    const [label, setLabel] = useState('Turnos por esperar');


    const getTurn = () => {
        if(titleButton === 'Pedir Turno'){
            dispatch({
                type: 'INCREASE_WAITING_QUEUE'
            })
            setTitleButton('Cancelar Turno');
        } else {
            showAlert();
        }
    }

    const cancelTurn = () => {
        dispatch({
            type: 'TO_DISCOUNT_A_WAITING_QUEUE'
        })
        setTitleButton('Pedir Turno');
    }

    const showAlert = () => {
        Alert.alert(
            'Atencion',
            'Desea cancelar su turno?',
            [
                {
                    text: 'Si',
                    onPress: () => cancelTurn()
                },
                {text: 'No'}
            ],

        )
    }

    return (
        <>
            <ScrollView style={bussinesScreenStyles.scroll}>
                <View style={bussinesScreenStyles.content}>
                    <Text style={bussinesScreenStyles.titleScreen}>Este negocio tiene aproximadamente 20</Text>
                    <Text style={bussinesScreenStyles.titleScreen}>minutos de espera</Text>

                    <WaitingQueueComponent
                        label = {label}
                        waitTurn = {currentTurn}
                        styleBox = {bussinesScreenStyles.boxTurn}
                        styleTitle = {bussinesScreenStyles.titleTurn}
                        styleNumber = {bussinesScreenStyles.numberTurn}
                    />

                    <View style={bussinesScreenStyles.boxTurn}>
                        <Text style={bussinesScreenStyles.titleTurn}>
                            Tu turno
                        </Text>
                        <Text style={bussinesScreenStyles.numberTurn}>
                            {currentTurn || '- -'}
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
