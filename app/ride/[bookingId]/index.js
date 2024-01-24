import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_DATABASE } from '../../../fireabase';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { SafeAreaView } from 'react-native';
import { MaterialIcons  } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
const style = require('../../styles');

export default function Index() {
    const { bookingId } = useLocalSearchParams(); // props data
    const [booking, setBooking] = useState(null);
    const router = useRouter();

  useEffect(() => {
    getBookingByUserId();
  }, [])

  const getBookingByUserId = async () => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'bookings', bookingId);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Use the retrieved data as needed
        if (data.status == 'searching' || data.status == 'accepted') setBooking(data);

      } else {
        // Handle case where document with the specified ID doesn't exist
      } 
    } catch (error) {
      // Handle any errors that occur during the data retrieval
      console.log('error');
      console.error(error);
    }
  };

  const acceptBooking = async () => {
    try {
      const bookingData = {
        origin: booking.origin,
        destination: booking.destination,
        status: 'accepted',
        user: booking.user,
        userId: booking.userId
      }
      const docRef = doc(FIREBASE_DATABASE, 'bookings', booking.userId);
      await setDoc(docRef, bookingData);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }

  const cancelBooking = async () => {
    try {
      const collectionRef = collection(FIREBASE_DATABASE, 'bookings');
      const bookingData = {
        origin: booking.origin,
        destination: booking.destination,
        status: 'cancelled',
        user: booking.user,
        userId: booking.userId
      }
      const docRef = doc(FIREBASE_DATABASE, 'bookings', booking.userId);
      await setDoc(docRef, bookingData);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
}

  const completeBooking = async () => {
    try {
      const collectionRef = collection(FIREBASE_DATABASE, 'bookings');
      const bookingData = {
        origin: booking.origin,
        destination: booking.destination,
        status: 'completed',
        user: booking.user,
        userId: booking.userId
      }
      const docRef = doc(FIREBASE_DATABASE, 'bookings', booking.userId);
      await setDoc(docRef, bookingData);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={style.theme_wrapper}>
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
        <View>
            {booking?.status == 'searching' && (
                <MaterialIcons.Button 
                    style={styles.button_action} 
                    name="schedule" size={24} 
                    backgroundColor="#FFCDA8" 
                    color="#000000"
                    onPress={() => acceptBooking()}
                >
                    Accept booking
                </MaterialIcons.Button>
            )}
            {booking?.status == 'accepted' && (
                <View>
                    <MaterialIcons.Button 
                        style={styles.button_action} 
                        name="schedule" size={24} 
                        backgroundColor="#FFCDA8" 
                        color="#000000"
                        onPress={() => completeBooking()}
                    >
                        Complete ride
                    </MaterialIcons.Button>

                    <MaterialIcons.Button 
                        style={styles.button_action} 
                        name="schedule" size={24} 
                        backgroundColor="#FFCDA8" 
                        color="#000000"
                        onPress={() => cancelBooking()}
                    >
                        Cancel ride
                    </MaterialIcons.Button>
                </View>
            )}
        </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    card_ride: {
        width: 250, 
        height: 90, 
        backgroundColor: 'white', 
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        marginBottom: 10

    },
    button_action: {
        width: 250,
        height: 70,
        textAlign: "center",
        paddingLeft: 50
      },
});