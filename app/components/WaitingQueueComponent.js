import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {status} from '../utils'
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging'

export const WaitingQueueComponent = (props) => {
    const dispatch = useDispatch()
    const fcmToken = useSelector(state => state.fcmToken)
    const loadRT = async () => {
        const turns = firestore()
            .collection('turns')
            .where('status', '==', status.ACTIVE)
            .onSnapshot(query => {
                const turns = query.docs
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
        if(!fcmToken)
            loadToken()
    }, [])
    return (
        <>
            <View style={props.styleBox}>
                <Text style={props.styleTitle}>
                    {props.label}
                </Text>
                <Text style={props.styleNumber}>
                    {props.waitTurn}
                </Text>
            </View>
        </>
    )
}