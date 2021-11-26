import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Button, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import adminScreenStyles from '../styles/adminScreenStyle';
import { status } from '../utils';
import { WaitingQueueComponent } from './WaitingQueueComponent';
import firestore from '@react-native-firebase/firestore'
import check from '../assets/icons/check-solid.png'
import close from '../assets/icons/times-solid.png'

export const AdminScreen = () => {
    const [titleButton, setTitleButton] = useState('Llamar Turno');
    const [turns, setTurns] = useState([]);
    const {currentTurn, waitingQueue} = useSelector(({waitingQueue,currentTurn}) => {
        return {
            waitingQueue,
            currentTurn
        }
    })
    const dispatch = useDispatch()
    const [label, setLabel] = useState('Turnos en espera');

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        const turnArray = firestore()
            .collection('turns')
            .where('status', '==', status.ACTIVE)
            .orderBy('turn_id', 'asc')
            .onSnapshot(query => {
                if(query && query.docs){
                    const turnsR = query.docs.map(elemento => {
                        return {
                            ...elemento.data(),
                            id: elemento.id
                        }
                    })
                    console.log(turnsR)
                    setTurns(turnsR)
                }
            })
        
        return () => turnArray()
    }

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

    const handleStatus = async (elto, statusChange) => {

        if(elto && elto.turn_id){
            firestore().collection('turns')
                    .doc(elto.id)
                    .update({
                        status: statusChange
                    })
                    .then(() => {
                        Alert.alert('Alert', 'Persona por atender:' + elto.name)
                    });
        }
        console.log('Cambiando status');
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

                <View>
                    <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={1} style={{flex: .2, justifyContent: 'center'}}>Turno</Text>
                        <Text numberOfLines={1} style={{flex: .3, justifyContent: 'center'}}>Nombre</Text>
                        <Text numberOfLines={1} style={{flex: .3, justifyContent: 'center'}}>Email</Text>
                        <Text numberOfLines={1} style={{flex: .2, justifyContent: 'center'}}>Accion</Text>
                    </View>
                    {
                        turns.map(elto => {
                            return (
                                <View style={{flexDirection: 'row'}} key={elto.email}>
                                    <Text numberOfLines={1} style={{flex: .2, justifyContent: 'center'}}>{elto.turn_id}</Text>
                                    <Text numberOfLines={1} style={{flex: .3, justifyContent: 'center'}}>{elto.name}</Text>
                                    <Text numberOfLines={1} style={{flex: .3, justifyContent: 'center'}}>{elto.email}</Text>
                                    <View style={{flex: .2}}>
                                        <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => handleStatus(elto, status.IN_PROGRESS)}>
                                            <Image style={{tintColor: '#FFF', width: 15, height: 15, padding: 2}} resizeMode='contain' source={check}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleStatus(elto, status.INACTIVE)}>
                                            <Image style={{tintColor: '#FFF', width: 15, height: 15, padding: 2}} resizeMode='contain' source={close}/>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </>
    )
}