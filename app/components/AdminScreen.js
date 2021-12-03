import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Button, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import adminScreenStyles from '../styles/adminScreenStyle';
import { status } from '../utils';
import { WaitingQueueComponent } from './WaitingQueueComponent';
import firestore from '@react-native-firebase/firestore'
import check from '../assets/icons/check-solid.png'
import close from '../assets/icons/times-solid.png'
import functions from '@react-native-firebase/functions';


export const AdminScreen = () => {
    const [titleButton, setTitleButton] = useState('Llamar Turno');
    const fcmToken = useSelector(state => state.fcmToken)
    const [turns, setTurns] = useState([]);
    const {currentTurn, waitingQueue, currentDocId} = useSelector(({waitingQueue,currentTurn,currentDocId}) => {
        return {
            waitingQueue,
            currentTurn,
            currentDocId
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
        if(!waitingQueue){
            showValidationAlert();
        } else {
            updateCurrentTurn();
        }
    }

    const updateCurrentTurn = async () => {
        let name = ''
        let fcm_token = ''
        let id = ''
        if(!!currentTurn){
            const currentTurnQuery = await firestore().collection('turns')
                .where('turn_id', '>=', currentTurn)
                .where('status', '==', status.ACTIVE)
                .orderBy('turn_id', 'asc')
                .limit(5)
                .get()
            if(!!currentTurnQuery?.docs?.length){
                const docs = currentTurnQuery.docs[0]
                id = docs.id
                const {name: _name} = docs.data()
                fcm_token = currentTurnQuery.docs.map(element => element.data().fcm_token)
                name = _name
            }
        }else{
            const firstTurnQuery  = await firestore().collection('turns')
                .where('status', '==', status.ACTIVE)
                .orderBy('turn_id', 'asc')
                .limit(5)
                .get()
            const item = firstTurnQuery.docs[0]
            id = item.id
            const {fcm_token: _fcmToken, name: _name} = item.data()
            name = _name
            fcm_token = firstTurnQuery.docs.map(element => element.data().fcm_token)
        }
        if(currentDocId){
            sendPushNotification(currentDocId, 'Tu turno ha terminado.')
            firestore()
                .collection('turns')
                .where('status', '==', status.IN_PROGRESS)
                .get()
                .then(query => {
                    const items = query.docs
                    items.forEach(element => {
                        firestore()
                            .collection('turns')
                            .doc(element.id)
                            .update({
                                status: status.INACTIVE
                            })
                    })
                })
        }
        await firestore()
            .collection('turns')
            .doc(id)
            .update({
                status: status.IN_PROGRESS
            })
        sendPushNotification(fcm_token)
        Alert.alert('Se ha cambiado de turno', 'La siguiente persona en turno es: '+name)
    }

    const sendPushNotification  = (fcm_token, message = '¡Es tu turno!') => {
        if(Array.isArray(fcm_token)){
            const next = fcm_token[0]
            functions()
                .httpsCallable('sendPushNotification')({token: next, message})
            const others = fcm_token.slice(1, fcm_token.length)
                others.forEach((element, i) => {
                    functions()
                        .httpsCallable('sendPushNotification')({token: element, message: '¡Ya casi! Quedan '+(i+1)+' turnos delante de ti'})
                })
        }else{
            functions()
                .httpsCallable('sendPushNotification')({token: fcm_token, message})
        }
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
            if(statusChange === status.IN_PROGRESS){
                const currentTurnQuery = await firestore().collection('turns')
                        .where('status', '>=', status.IN_PROGRESS)
                        .get()
                        if(currentTurnQuery.docs){
                            currentTurnQuery.docs.forEach(async elto => {
                                const id = elto.id
                                await firestore()
                                .collection('turns')
                                .doc(id)
                                .update({
                                    status: status.INACTIVE
                                })
    
                                sendPushNotification(elto.data().fcm_token, 'Tu turno ha terminado.')
                            })
                        }
            }

            firestore().collection('turns')
                    .doc(elto.id)
                    .update({
                        status: statusChange
                    })
                    .then( async () => {
                        if(statusChange === status.INACTIVE){
                            Alert.alert('Alert', 'Persona rechazada:' + elto.name)
                        } else {
                            Alert.alert('Alert', 'Persona por atender:' + elto.name)
                            sendPushNotification(elto.fcm_token)
                        }
                    });
        }
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
                        onPress={() => callTurn()}
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