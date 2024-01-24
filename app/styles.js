'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    theme_wrapper: { 
        flex: 1,
        alignItems: "center", 
        backgroundColor: '#FFE4A7'
    },
    main: { 
        flex: 1,
        backgroundColor: '#FFE4A7'
    },
    menu: {
        backgroundColor: "#e6a6f7",
    },
    dashboard_wrapper: {
        flex: 1, 
        alignItems: "center"
    },
    is_flex: {
        flex: 1
    },
    is_flex_h_half: {
        height: '50%', 
        flex: 1
    },
    input_default: {
        height: 40,
        marginTop: 7,
        width: 200,
        padding: 10,

    },
    autocomplete_list: {
        width: 250, 
        height: 300, 
        backgroundColor: 'white', 
        borderRadius: 5
    },
    booking_list: {
        width: 250,
        borderRadius: 5
    },
    m_10: {
        marginTop: 10
    },
    w_full: {
        width: '100%'
    },
    action_button: {
        width: 250,
        height: 50,
        borderWidth:5,
        borderColor:"",
    },
    logo: {
        marginTop:55,
        marginLeft:40,
        marginBottom:50,
        height: 150,
        width: 150,
        borderRadius: 50,
    },
    is_flex_row: {
        flexDirection: 'row'
    },
    bottom:{
        position:'relative',
        bottom: -25
    },
    input_container:{
        flexDirection: 'row',
        width: 250,
        height:40,
        marginTop:20,
        backgroundColor:'#FFFAD7',
        borderRadius:15,
    },
    icon:{
        paddingTop:9,
    },
    action_container:{
        marginLeft:120, 
        marginTop:40, 
        padding:5,
        width:130,
        height:50,
        borderRadius:50,
      },
      center:{
        flex:1,
        alignItems:'center',
      },
      CheckBoxContainer:{
        flexDirection: 'row',
        width: 250,

      },
});