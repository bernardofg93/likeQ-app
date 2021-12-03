import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Button, RefreshControl, Pressable } from 'react-native';
import bussinesScreenStyles from '../styles/bussinesScreenStyles';
import { WaitingQueueComponent } from './WaitingQueueComponent';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'
import { status } from '../utils';

export const BussinesScreen = () => {
    const defaultFormState = {
        name: '',
        email: '',
        id: ''
    }
    const user = useSelector(state => state.user)
    const [refreshing, setRefreshing] = useState(false)
    const [visible, setVisible] = useState(false)
    const [form, setForm] = useState(defaultFormState)
    const {currentTurn, myTurn, fcmToken} = useSelector(({myTurn, currentTurn, fcmToken}) => {
        return {
            myTurn,
            currentTurn,
            fcmToken
        }
    })
    const load = async () => {
        try {
            setRefreshing(true)
            const _myTurn = await firestore().collection('turns')
                .where('status', '==', status.ACTIVE)
                .where('email', '==', form.email || user.email)
                .limit(1)
                .get()
            if(!!_myTurn.docs?.length){
                const turn = _myTurn.docs[0].data().turn_id
                dispatch({
                    type: 'SET_MY_TURN',
                    payload: parseInt(turn)
                })
                setTitleButton('Cancelar Turno')
            }
        } catch (error) {
            console.log('>>: error > ', error)
        }finally{
            setRefreshing(false)
        }
    }
    useEffect(() => {
        load()
        if(!currentTurn){
            setTitleButton('Pedir Turno')
        }
    }, [currentTurn]);

    const dispatch = useDispatch()
    const [label, setLabel] = useState('Turnos por esperar');
    const [titleButton, setTitleButton] = useState('Pedir Turno')


    const getTurn = () => {
        if(titleButton === 'Pedir Turno'){
            setVisible(true)
        } else {
            showAlert();
        }
    }
    const onSubmit = async () => {
        try {
            if(!form?.email?.includes('@')){
                Alert.alert('El correo debe contener un @')
                return false
            }
            setRefreshing(true)
            if((!!form.email || !!user?.email)  && fcmToken){
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
                            dispatch({
                                type: 'SET_MY_TURN',
                                payload: currentId
                            })
                            setTitleButton('Cancelar Turno')
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
                    dispatch({
                        type: 'SET_MY_TURN',
                        payload: 0
                    })
                    setTitleButton('Pedir Turno')
                    setRefreshing(false)
                });
            if(visible)
                setVisible(false)
        }
    }

    const showAlert = () => {
        Alert.alert(
            'Atención',
            '¿Desea cancelar su turno?',
            [
                {
                    text: 'Si',
                    onPress: () => cancelTurn()
                },
                {text: 'No'}
            ],

        )
    }
    const handleChange = (key, value: string) => {
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
                transparent={true}
            >
                <View style={bussinesScreenStyles.centeredView}>
                    <View style={bussinesScreenStyles.modalView}>
                        <Text style={bussinesScreenStyles.modalText}>Ingrese su nombre</Text>
                        <TextInput
                            onChangeText={text => handleChange('name', text)}
                            value={form.name}
                            style={bussinesScreenStyles.input}
                        />
                        <Text style={bussinesScreenStyles.modalText}>Ingrese su email</Text>
                        <TextInput
                            onChangeText={text => handleChange('email', text)}
                            value={form.email}
                            style={bussinesScreenStyles.input}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Pressable
                                disabled={!form.email || !form.name}
                                style={[bussinesScreenStyles.button, bussinesScreenStyles.buttonClose]}
                                onPress={() => onSubmit()}>
                                    <Text style={bussinesScreenStyles.textStyle}>Reservar Turno</Text>
                            </Pressable>

                            <Pressable
                                style={[bussinesScreenStyles.button, bussinesScreenStyles.buttonClose]}
                                onPress={() => onClose()}>
                                    <Text style={bussinesScreenStyles.textStyle}>Cerrar</Text>
                            </Pressable>
                        </View>
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
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10
                        }}
                    >
                        <WaitingQueueComponent
                            label={label}
                            waitTurn={myTurn && currentTurn ? myTurn - currentTurn : 0}
                            styleBox={bussinesScreenStyles.boxTurn}
                            styleTitle={bussinesScreenStyles.titleTurn}
                            styleNumber={bussinesScreenStyles.numberTurn}
                        />

                        <View style={bussinesScreenStyles.boxTurn}>
                            <Text style={bussinesScreenStyles.titleTurn}>
                                Tu turno
                            </Text>
                            <Text style={bussinesScreenStyles.numberTurn}>
                                {myTurn || '- -'}
                            </Text>
                        </View>
                    </View>
                    <View style={bussinesScreenStyles.boxTurn}>
                        <Text style={bussinesScreenStyles.titleTurn}>
                            Turno Actual
                        </Text>
                        <Text style={bussinesScreenStyles.numberTurn}>
                            {currentTurn || 0}
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
