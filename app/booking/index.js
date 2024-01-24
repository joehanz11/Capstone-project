import { View, StyleSheet } from "react-native";
import MapNavigation from "../../components/MapNavigation";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react'
import { FIREBASE_DATABASE } from '../../fireabase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';
import { Card, Button, Snackbar, Text  } from 'react-native-paper';
const style = require('../styles');

const Booking = ({ route, navigation }) => {
  const router = useRouter();
  const { userBookingId, userType, uid } = route.params;
  const [destination, setDestination ] = useState({
    lon: null,
    lat: null,
  });
  const [origin, setOrigin ] = useState({
    lon: null,
    lat: null,
  });
  const [booking, setBooking ] = useState({
    destination: '',
    origin: 'null',
    fare: 0,
    distance: 0,
    duration: '',
    status: ''
  });
  //   snackbar
    const [visible, setVisible] = React.useState(false);
    const [cancelVisible, setCancelVisible] = React.useState(false);
    cancelVisible
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const onToggleCancelSnackBar = () => setCancelVisible(!cancelVisible);
    const onDismissCancelSnackBar = () => setCancelVisible(false);

  const getBookingByUserId = async () => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userBookingId);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Use the retrieved data as needed
        setDestination({
          lon: parseFloat(data.destinationLon),
          lat: parseFloat(data.destinationLat),
        })
        setOrigin({
          lon: parseFloat(data.originLon),
          lat: parseFloat(data.originLat),
        })
        setBooking({
          destination: data.destination,
          origin: data.origin,
          fare: data.fare,
          distance: data.distance,
          duration: data.duration,
          status: data.status,
          originLat: data.originLat,
          originLon: data.originLon,
          destinationLat: data.destinationLat,
          destinationLon: data.destinationLon,
          user: data.user,
          userId: data.userId,
          accepted_by: data.accepted_by
        });

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
      const bookingData = booking;
      booking.status = 'accepted';
      booking.accepted_by = uid;
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userBookingId);
      await setDoc(docRef, bookingData);
      setVisible(true);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }

  const cancelRide = async () => {
    try {
      const bookingData = booking;
      booking.status = 'cancelled';
      booking.accepted_by = '';
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userBookingId);
      await setDoc(docRef, bookingData);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }

  const cancelByRider = async () => {
    try {
      const bookingData = booking;
      booking.status = 'searching';
      booking.accepted_by = '';
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userBookingId);
      await setDoc(docRef, bookingData);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }

  const completeBooking = async () => {
    try {
      const bookingData = booking;
      booking.status = 'completed';
      booking.accepted_by = uid;
      const docRef = doc(FIREBASE_DATABASE, 'bookings', userBookingId);
      await setDoc(docRef, bookingData);
      setVisible(true);
      router.replace('/')
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  }


  useEffect(() => {
    getBookingByUserId();
  },[])

  return (
    <View style={style.main}>
      <View style={style.is_flex}>
        <View style={style.is_flex_h_half}>
          {destination.lat && origin.lat && (
            <MapNavigation destination={destination} origin={origin} />
          )}
        </View>
        <View style={style.is_flex_h_half}>
          <Card style={style.is_flex_h_half}>
            <Card.Content>

              {booking.status == 'searching' && (
                <Button style={styles.car_button} icon="map-search-outline" mode='outlined'>
                  Searching...
                </Button>
              )}
              {booking.status == 'accepted' && (
                <Button style={styles.car_button} icon="progress-check" mode='outlined' buttonColor="#50C878" textColor="#ffffff">
                  Accepted
                </Button>
              )}
            </Card.Content>
          </Card>
        </View>
      </View>
      <Card style={styles.card_other}>
        <Card.Content>
          <Button style={styles.label_button} icon="av-timer" mode="text" >
            <Text variant="labelSmall">Estimated Time: {booking.duration}</Text>
          </Button>
          <Button style={styles.label_button} icon="currency-php" mode="text" >
            <Text variant="labelSmall">{booking.fare} ( { booking.distance  } KM )</Text>
          </Button>
          {userType == 'customer' && (
            <View>
            {booking.status = 'accepted' && (
              <View style={styles.center}>
                <Text style={{color: 'black'}} variant="labelMedium">On Route</Text>
              </View>
              
            )} 
            {booking.status == 'searching' && (
              <View>
              <Button onPress={() => {cancelRide()}} style={styles.car_button} icon="cancel" mode="outlined" buttonColor="#B0002033" textColor="black">
              <Text style={{color: 'black'}} variant="labelMedium">Cancel Booking</Text>
              </Button>  
              </View>
              
            )}
            
            </View>
            
          )}
          {userType == 'driver' && (
            <View style={styles.action_button_wrapper}>
              {booking.status == 'accepted' && (
                <View style={styles.action_button_wrapper}>
                  <Button onPress={() => {completeBooking()}} style={styles.car_action_button} icon="check-bold" mode="outlined" buttonColor="#50C878" textColor="#ffffff">
                    <Text style={{color: '#ffffff'}} variant="labelSmall">Complete</Text>
                  </Button>
                  <Button onPress={() => {cancelByRider()}} style={styles.car_action_button} icon="cancel" mode="outlined" buttonColor="#B0002033" textColor="#ffffff">
                    <Text style={{color: '#ffffff'}} variant="labelSmall">Cancel Booking</Text>
                  </Button>
                </View>
              )}
              {booking.status == 'searching' && (
                <Button onPress={() => {acceptBooking()}} style={styles.car_action_button_w100} icon="check" mode="outlined" buttonColor="#50C878" textColor="#ffffff">
                  <Text style={{color: '#ffffff'}} variant="labelSmall">Accept Booking</Text>
                </Button>
              )}

            </View>
          )}
        </Card.Content>
          <Snackbar
              onDismiss={() => onToggleSnackBar()}
              visible={visible}
              duration="2000"
            >
            Booked successfully
          </Snackbar>
          <Snackbar
            onDismiss={() => onToggleCancelSnackBar()}
            visible={cancelVisible}
            duration="2000"
            >
            Booking cancelled
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
  car_action_button: {
    borderRadius: 5, 
    marginTop: 5,
    width: 150,
    height: 37
  },
  car_action_button_w100: {
    borderRadius: 5, 
    marginTop: 5,
    width: '100%',
    height: 37
  },
  label_button: {
    borderRadius: 5, 
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  action_button_wrapper: {
    flex: 1, 
    justifyContent: 'space-evenly', 
    flexDirection: 'row', 
    flexWrap: 'wrap'
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
export default Booking;