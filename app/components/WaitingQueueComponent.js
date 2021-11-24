import React, { useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';

export const WaitingQueueComponent = (props) => {
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