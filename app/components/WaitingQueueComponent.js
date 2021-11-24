import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';

export const WaitingQueueComponent = (props) => {
    const turnsToWait = useSelector(state => state.waitingQueue)
    return (
        <>
            <View style={props.styleBox}>
                <Text style={props.styleTitle}>
                    {props.label}
                </Text>
                <Text style={props.styleNumber}>
                    {turnsToWait}
                </Text>
            </View>
        </>
    )
}