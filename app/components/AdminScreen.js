import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Button, Image, StyleSheet } from 'react-native';
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

    const updateCurrentTurn = async () => {
        if(currentTurn){
            const currentTurnQuery  = await firestore().collection('turns')
                .where('turn_id', '==', currentTurn)
                .where('status', '==', status.ACTIVE)
                .orderBy('turn_id', 'asc')
                .get()
            console.log('>>: current ', currentTurnQuery.docs)
        }else{
            const firstTurnQuery  = await firestore().collection('turns')
                .where('status', '==', status.ACTIVE)
                .orderBy('turn_id', 'asc')
                .limit(1)
                .get()
            const {id} = firstTurnQuery
            const {fcm_token} = firstTurnQuery.docs
            await firestore()
                .doc(id)
                .update({
                    status: status.IN_PROGRESS
                })
            sendPushNotification(fcm_token)
            console.log('>>: first turn', firstTurnQuery.docs)
        }
    }

    const sendPushNotification  = fcm_token => {
        console.log('>>: receiving token > ', fcm_token)
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
                        if(statusChange === status.INACTIVE){
                            Alert.alert('Alert', 'Persona rechazada:' + elto.name)
                        } else {
                            Alert.alert('Alert', 'Persona por atender:' + elto.name)
                        }
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
                            {currentTurn || '- -'}
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
                        <Text numberOfLines={1} style={[{flex: .2}, styles.justifyContentCenter]}>Turno</Text>
                        <Text numberOfLines={1} style={[{flex: .3}, styles.justifyContentCenter]}>Nombre</Text>
                        <Text numberOfLines={1} style={[{flex: .3}, styles.justifyContentCenter]}>Email</Text>
                        <Text numberOfLines={1} style={[{flex: .2}, styles.justifyContentCenter]}>Accion</Text>
                    </View>
                    {
                        turns.map(elto => {
                            return (
                                <View style={{flexDirection: 'row'}} key={elto.id}>
                                    <Text numberOfLines={1} style={[{flex: .2}, styles.justifyContentCenter]}>{elto.turn_id}</Text>
                                    <Text numberOfLines={1} style={[{flex: .3}, styles.justifyContentCenter]}>{elto.name}</Text>
                                    <Text numberOfLines={1} style={[{flex: .3}, styles.justifyContentCenter]}>{elto.email}</Text>
                                    <View style={{flex: .2}}>
                                        <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => handleStatus(elto, status.IN_PROGRESS)}>
                                            <Image style={styles.icon} resizeMode='contain' source={check}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleStatus(elto, status.INACTIVE)}>
                                            <Image style={styles.icon} resizeMode='contain' source={close}/>
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
const styles = StyleSheet.create({
    justifyContentCenter: {
        justifyContent: 'center',
        color: '#fff'
    },
    icon:{tintColor: '#FFF', width: 15, height: 15, padding: 2}
})