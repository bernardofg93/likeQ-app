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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#51cbd4",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        padding: 10,
        elevation: 2,
        marginTop: 5,
        marginRight: 10,
        flex: .5,
        backgroundColor: '#000'
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: '#000'
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 5,
        textAlign: "center",
        color: '#000',
        fontWeight: 'bold'
      },
      input: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 240,
        color: '#000'
      },
})

export default bussinesScreenStyles;