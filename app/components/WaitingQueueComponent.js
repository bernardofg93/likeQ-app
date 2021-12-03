import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {status} from '../utils'
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging'

export const WaitingQueueComponent = (props) => {
    const dispatch = useDispatch()
    const fcmToken = useSelector(state => state.fcmToken)
    const currentTurn = useSelector(state => state.currentTurn)
    const loadRT = async () => {
        const turns = firestore()
            .collection('turns')
            .where('status', '==', status.ACTIVE)
            .onSnapshot(query => {
                const turns = query.docs
                const exist = turns.map(element => element.data()).some(element => element.fcm_token === fcmToken)
                if(!exist){
                    dispatch({
                        type: 'SET_ACTUAL_TURN',
                        payload: 0
                    })
                }
                dispatch({
                    type: 'SET_WAITING_QUEUE',
                    payload: turns.length || 0
                })
            })
        return () => turns()
    }
    const loadToken = async () => {
        const token = await messaging().getToken();
        dispatch({
            type: 'SET_TOKEN',
            payload: token 
        })
    }
    React.useEffect(() => {
        loadRT()
        getCurrentTurn()
        if(!fcmToken)
            loadToken()
    }, [])

    const getCurrentTurn = () => {
        const turnArray = firestore()
            .collection('turns')
            .where('status', '==', status.IN_PROGRESS)
            .limit(1)
            .onSnapshot(query => {
                const data = query?.docs?.[0]?.data()
                if(!!data){
                    const turn = data.turn_id
                    dispatch({
                        type: 'SET_ACTUAL_TURN',
                        payload: turn
                    })
                    const _fcm_token = data.fcm_token
                    dispatch({
                        type: 'SET_CURRENT_DOC_ID',
                        payload: _fcm_token
                    })
                } else {
                    dispatch({
                        type: 'SET_ACTUAL_TURN',
                        payload: 0
                    })
                    dispatch({
                        type: 'SET_CURRENT_DOC_ID',
                        payload: null
                    })
                }
            })
        
        return () => turnArray()
    }
    return (
        <>
            <View style={props.styleBox}>
                <Text style={props.styleTitle}>
                    {props.label}
                </Text>
                <Text style={props.styleNumber}>
                    {props.waitTurn > 0 ? props.waitTurn : '- -'}
                </Text>
            </View>
        </>
    )
}