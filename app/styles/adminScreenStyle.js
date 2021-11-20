import { StyleSheet } from 'react-native';

const adminScreenStyles = StyleSheet.create({
    containerArea: {
        flex: 1,
    },
    scroll: {
        backgroundColor: '#000'
    },
    titleScreen: {
        color: '#51cbd4',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'red'
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxTurn: {
        flex: 1,
        borderWidth: 4,
        borderTopLeftRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        width: 350,
        borderColor: '#51cbd4'
    },
    titleTurn: {
        color: '#51cbd4',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    numberTurn: {
        color: '#51cbd4',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 70
    },
    callTurn: {
        flex: 1,
        width: 350,
        padding: 15,
        backgroundColor: '#51cbd4',
        marginTop: 10
    },
    callTurnTxt: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center'
    }
})

export default adminScreenStyles;