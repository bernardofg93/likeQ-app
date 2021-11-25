import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import {status} from '../utils'
import { useDispatch } from 'react-redux';

export const WaitingQueueComponent = (props) => {
    const dispatch = useDispatch()
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
                console.log('>>: query > ', turns)
            })
        return () => turns()
    }
    React.useEffect(() => {
        loadRT()
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