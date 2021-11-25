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
        name: '',
        email: ''
    }
    const user = useSelector(state => state.user)
    const [titleButton, setTitleButton] = useState('Pedir Turno');
    const [refreshing, setRefreshing] = useState(false)
    const [visible, setVisible] = useState(false)
    const [form, setForm] = useState(defaultFormState)
    const {currentTurn, waitingQueue} = useSelector(({waitingQueue,currentTurn}) => {
        return {
            waitingQueue,
            currentTurn
        }
    })

    useEffect(() => {
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
            setTitleButton('Cancelar Turno');
        } else {
            showAlert();
        }
    }
    const onSubmit = async () => {
        try {
            console.log('>>: form > ', form)
            // dispatch({
            //     type: 'SET_USER',
            //     payload: form
            // })
        } catch (error) {
            console.log('>>: error > ', error)
        }
    }

    const onClose = () => {
        setVisible(false)
        setForm(defaultFormState)
    }
    const cancelTurn = () => {
        if(form.email || user.email){
            setRefreshing(true)
            firestore().collection('turns')
                .where('status', '==', status.ACTIVE)
                .where('email', '==', form.email || user.email)
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
    return (
        <>
            <Modal
                visible={visible}
                animationType='slide'
            >
                <View>
                    <Text>Ingrese su nombre</Text>
                    <TextInput
                        onChangeText={text => console.log('>>: text > ', text)}
                    />
                    <Text>Ingrese su email</Text>
                    <TextInput
                        onChangeText={text => console.log('>>: text > ', text)}
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
