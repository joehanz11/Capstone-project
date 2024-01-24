import { View, StyleSheet } from "react-native";
import MapNavigation from "../../components/MapNavigation";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react'
import { FIREBASE_DATABASE } from '../../fireabase';
import { doc, setDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';
import { Card, Button, Snackbar, Text  } from 'react-native-paper';
import { useRef } from "react";
const style = require('../styles');

const Confirmation = ({ route }) => {
  const { originalLon, originalLat, destinationLon, destinationLat, originName, destinationName } = route.params;
  const [destination, setDestination ] = useState({
    lon: parseFloat(destinationLon),
    lat: parseFloat(destinationLat),
    name: originName
  });
  const [origin, setOrigin] = useState({
    lon: parseFloat(originalLon),
    lat: parseFloat(originalLat),
    name: destinationName
  });
  const router = useRouter();
  const [selectedCarType, setSelectedCarType] = useState('fourSeater');
  const [eta, setEta] = useState({
    distance: 0,
    duration: 0,
  });
  const [duration, setDuration] = useState('0');
  const [fare, setFare] = useState(0);
  
  // // User info
  const [email, setEmail] = useState(null)
  const [userUUID, setUserUUID] = useState(null)

  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  //load state
  const isBooking = useRef(false);


  useEffect(() => {
    setUserValue();
  })

  const bookARide = async () => {
    isBooking.current = true;
    const bookingData = {
      origin: origin.name,
      destination: destination.name,
      user: email,
      userId: userUUID,
      status: 'searching',
      distance: eta.distance,
      duration: duration,
      fare: fare,
      originLat: origin.lat,
      originLon: origin.lon,
      destinationLat: destination.lat,
      destinationLon: destination.lon,
      accepted_by :''
    }

    try {
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userUUID);
      await setDoc(docRef, bookingData);
      onToggleSnackBar();
      router.replace('/');
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
      isBooking.current = false;
    }
  }

  async function setUserValue() {
    let email = await SecureStore.getItemAsync('auth');
    let userUUID = await SecureStore.getItemAsync('authId');
    setEmail(email);
    setUserUUID(userUUID);
  }

  const etaInformation = (information) => {
    calculateETA(information?.duration ? information?.duration : 0);
    calculateFare(information?.distance, information?.duration);
    setEta({
      distance: information?.distance,
      duration: information?.duration
    });
  }

  const calculateETA = (minuteDuration) => {
    const num = minuteDuration;
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    const total = rhours + " hour(s) and " + rminutes + " minute(s).";
    setDuration(total);
  }

  const calculateFare = (fareDistance, fareDuration) => {
    if (!fareDistance) return 0
    const farePerKM = parseFloat(fareDistance) * 13.5 // Php 13.5 per KM
    const farePlusFixedPrice = farePerKM + 40 // + Php 40
    const farePerMinute = fareDuration * 2 // Php 2 per min
    let totalFare = farePlusFixedPrice + farePerMinute
    totalFare = totalFare.toFixed(2);
    setFare(totalFare);
  }

  return (
    <View style={style.main}>
      <View style={style.is_flex}>
        <View style={style.is_flex_h_half}>
          <MapNavigation destination={destination} origin={origin} etaInformation={etaInformation} />
        </View>
        <View style={style.is_flex_h_half}>
          <Card style={style.is_flex_h_half}>

            <Card.Content>
              <Button style={styles.car_button} icon="car-side" mode={selectedCarType == 'fourSeater' ? 'outlined' : 'contained'}  
                onPress={() => setSelectedCarType('fourSeater')} compact={true}>
                  EzDriveCar 4-Seater
              </Button>
              <Button style={styles.car_button} icon="car-pickup" mode={selectedCarType == 'sixSeater' ? 'outlined' : 'contained'} 
                onPress={() => setSelectedCarType('sixSeater')}>
                EzDriveCar 6-Seater
              </Button>
              <Button style={styles.car_button} icon="car-multiple" mode={selectedCarType == 'sharedSeater' ? 'outlined' : 'contained'}
                onPress={() => setSelectedCarType('sharedSeater')}>
                  EzDriveCar Shared Drive
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
      <Card style={styles.card_other}>
        <Card.Content>
          <Button style={styles.label_button} icon="av-timer" mode="text" >
            <Text variant="labelSmall">Estimated Time: {duration}</Text>
          </Button>
          <Button style={styles.label_button} icon="currency-php" mode="text" >
            <Text variant="labelSmall">{fare} ( { eta?.distance  } KM)</Text>
          </Button>
          <Button disabled={isBooking.current} onPress={() => bookARide()} style={styles.car_button} icon="calendar-blank-outline" mode="outlined" >
            <Text variant="labelMedium">Book a Ride</Text>
          </Button>
        </Card.Content>
        <Snackbar
          visible={visible}
          duration="2000"
        >
        Booked successfully
      </Snackbar>
      </Card>

    </View>
  );
}


const styles = StyleSheet.create({
  autocomplete_input: {
    height: 50,
    marginTop: 5
  },
  car_button: {
    borderRadius: 5, 
    marginTop: 5
  },
  label_button: {
    borderRadius: 5, 
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  card_other: {
    position: 'absolute', 
    bottom: '0%', 
    zIndex: 5, 
    height: 160, 
    width: '100%', 
    borderTopWidth: 1, 
    borderColor: 'red', 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0
  }
})
export default Confirmation;