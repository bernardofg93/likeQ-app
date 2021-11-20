import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import bussinesScreenStyles from '../styles/bussinesScreenStyles';
import { WaitingQueueComponent } from './WaitingQueueComponent';

export const BussinesScreen = () => {

    const [yourTurn, setYourTurn] = useState();
    const [titleButton, setTitleButton] = useState('Pedir Turno');
    const [waitTurn, setWaitTurn] = useState(44);
    const [label, setLabel] = useState('Turnos por esperar');


    const getTurn = () => {
        if(titleButton === 'Pedir Turno'){
            let newTurn = waitTurn + 1;
            setYourTurn(newTurn);
            setTitleButton('Cancelar Turno');
        } else {
            showAlert();
        }
    }

    const cancelTurn = () => {
        let newTurn = waitTurn - 1;
        setTitleButton('Pedir Turno');
        setYourTurn('- -');
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
                    waitTurn = {waitTurn}
                    styleBox = {bussinesScreenStyles.boxTurn}
                    styleTitle = {bussinesScreenStyles.titleTurn}
                    styleNumber = {bussinesScreenStyles.numberTurn}
                    />

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
