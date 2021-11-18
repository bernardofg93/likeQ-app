import { StyleSheet } from 'react-native';

const bussinesScreenStyles = StyleSheet.create({
    containerArea: {
        flex: 1,
    },
    scroll: {
        backgroundColor: '#51cbd4'
    },
    titleScreen: {
        color: '#000',
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
        width: 350
    },
    titleTurn: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    numberTurn: {
        color: '#000',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 70
    },
    cancelTurn: {
        flex: 1,
        width: 350,
        padding: 15,
        backgroundColor: '#000',
        marginTop: 10
    },
    cancelTurnTxt: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center'
    }
})

export default bussinesScreenStyles;