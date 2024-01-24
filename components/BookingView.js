import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_DATABASE } from './../fireabase';
import { doc, getDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native';
import { MaterialIcons  } from '@expo/vector-icons';
const style = require('../app/styles');

const BookingView = () => {
  const [userUUID, setUserUUID] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    setUserValue();
  }, [])
  async function setUserValue() {
    let userUUID = await SecureStore.getItemAsync('authId');
    setUserUUID(userUUID);
    await getBookingByUserId(userUUID);
  }

  const getBookingByUserId = async (id) => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'bookings', id);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Use the retrieved data as needed
        if (data.status == 'searching'){
          setBooking(data); 
        }          
           else {
            setBooking(data);
            
           }


      } else {
        // Handle case where document with the specified ID doesn't exist
      }
    } catch (error) {
      // Handle any errors that occur during the data retrieval
      console.log('error ', 'booking view');
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
        <View style={styles.card_ride}>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name="my-location" size={20} color="red" />
                <View style={{marginLeft: 5}}>
                    <Text>From:</Text>
                </View>
            </View>
            <View style={{flex: 1}}>
                    <TextInput
                        placeholder={`${booking?.origin}`}
                        editable={false}
                        numberOfLines={2}
                        
                    />
            </View>   

        </View>
        <View style={styles.card_ride}>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name="location-pin" size={20} color="blue" />
                <View style={{marginLeft: 5}}>
                    <Text>To:</Text>
                </View>
            </View>
            <View style={{flex: 1}}>
                <TextInput
                    placeholder={`${booking?.destination}`}
                    editable={false}
                    numberOfLines={2}
                />
            </View>
        </View>
        <View style={styles.card_ride}>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name="location-searching" size={20} color="green" />
                <View style={{marginLeft: 5}}>
                    <Text>Status:</Text>
                </View>
            </View>
            <View style={{flex: 1}}>
                <TextInput
                    placeholder={`${booking?.status}...`}
                    editable={false}
                    numberOfLines={2}
                />
            </View>
        </View>
    </SafeAreaView>

  )
}

export default BookingView

const styles = StyleSheet.create({

    card_ride: {
        width: 250, 
        height: 90, 
        backgroundColor: 'white', 
        borderRadius: 5,
        padding: 10,
        marginTop: 10

    }

});