import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button, RefreshControl } from 'react-native';
import bussinesScreenStyles from '../styles/bussinesScreenStyles';
import { WaitingQueueComponent } from './WaitingQueueComponent';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging'
import firestore from '@react-native-firebase/firestore'
import { status } from '../utils';

export const BussinesScreen = () => {
    const defaultFormState = {
        name: 'svarela@arkus.com',
        email: 'svarela@arkus.com',
        id: ''
    }
    const user = useSelector(state => state.user)
    const [titleButton, setTitleButton] = useState('Pedir Turno');
    const [refreshing, setRefreshing] = useState(false)
    const [visible, setVisible] = useState(false)
    const [form, setForm] = useState(defaultFormState)
    const {currentTurn, waitingQueue, fcmToken} = useSelector(({waitingQueue,currentTurn, fcmToken}) => {
        return {
            waitingQueue,
            currentTurn,
            fcmToken
        }
    })
    const load = async () => {
        try {
            setRefreshing(true)
            const myTurn = await firestore().collection('turns')
                .where('status', '==', status.ACTIVE)
                .where('email', '==', form.email || user.email)
                .limit(1)
                .get()
            if(myTurn.docs){
                const turn = myTurn.docs[0].data().turn_id
                setMyTurn(turn)
            }
        } catch (error) {
            console.log('>>: error > ', error)
        }finally{
            setRefreshing(false)
        }
    }
    useEffect(() => {
        load()
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('Push received', remoteMessage);
        });

        return unsubscribe;
    }, []);

    const dispatch = useDispatch()
    const [label, setLabel] = useState('Turnos por esperar');
    const [myTurn, setMyTurn] = useState(0)


    const getTurn = () => {
        if(titleButton === 'Pedir Turno'){
            setVisible(true)
        } else {
            showAlert();
        }
    }
    const onSubmit = async () => {
        try {
            setRefreshing(true)
            if((!!form.email || !!user && !!user.email)  && fcmToken){
                const lastItemQuery = await firestore().collection('turns')
                    .orderBy('turn_id', 'desc')
                    .limit(1)
                    .get()
                if(lastItemQuery.docs){
                    const lastId = lastItemQuery.docs[0].data().turn_id
                    const currentId = lastId+1
                    const {name, email} = form || user
                    const values = {
                        name,
                        email,
                        fcm_token: fcmToken,
                        status: status.ACTIVE,
                        turn_id: currentId
                    }
                    firestore()
                        .collection('turns')
                        .add(values)    
                        .then(query => {
                            const {id} = query
                            setMyTurn(currentId)
                            dispatch({
                                type: 'SET_USER',
                                payload: {
                                    ...form,
                                    id
                                }
                            })
                            const _form = {
                                ... form,
                                id
                            }
                            setForm(_form)
                            setTitleButton('Cancelar Turno')
                            setVisible(false)
                            Alert.alert('Se ha registrado un turno a su nombre')
                        });
                }
            }
        } catch (error) {
            console.log('>>: error > ', error)
        }
        finally{
            setRefreshing(false)
        }
    }

    const onClose = () => {
        setVisible(false)
        setForm(defaultFormState)
    }
    const cancelTurn = () => {
        if(form.id || user.id){
            setRefreshing(true)
            firestore().collection('turns')
                .doc(form.id || user.id)
                .update({
                    status: status.INACTIVE
                })
                .then(() => {
                    setMyTurn(0)
                    setTitleButton('Pedir Turno');
                    setRefreshing(false)
                });
            if(visible)
                setVisible(false)
        }
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
    const handleChange = (key, value) => {
        const _form = {
            ... form,
            [key]: value
        }
        setForm(_form)
    }
    return (
        <>
            <Modal
                visible={visible}
                animationType='slide'
            >
                <View>
                    <Text>Ingrese su nombre</Text>
                    <TextInput
                        onChangeText={text => handleChange('name', text)}
                        value={form.name}
                    />
                    <Text>Ingrese su email</Text>
                    <TextInput
                        onChangeText={text => handleChange('email', text)}
                        value={form.email}
                    />
                    <View
                        style={{flexDirection: 'row'}}
                    >
                        <Button
                            onPress={() => onSubmit()}
                            title='Reservar turno'
                        />
                        <Button
                            onPress={() => onClose()}
                            title='Cerrar'
                        />
                    </View>
                </View>
            </Modal>
            <ScrollView
                style={bussinesScreenStyles.scroll}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    // onRefresh={() => handleRefresh()}
                />}
            >
                <View style={bussinesScreenStyles.content}>
                    <Text style={bussinesScreenStyles.titleScreen}>Este negocio tiene aproximadamente 20</Text>
                    <Text style={bussinesScreenStyles.titleScreen}>minutos de espera</Text>

                    <WaitingQueueComponent
                        label = {label}
                        waitTurn = {waitingQueue}
                        styleBox = {bussinesScreenStyles.boxTurn}
                        styleTitle = {bussinesScreenStyles.titleTurn}
                        styleNumber = {bussinesScreenStyles.numberTurn}
                    />

                    <View style={bussinesScreenStyles.boxTurn}>
                        <Text style={bussinesScreenStyles.titleTurn}>
                            Tu turno
                        </Text>
                        <Text style={bussinesScreenStyles.numberTurn}>
                            {myTurn || '- -'}
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
