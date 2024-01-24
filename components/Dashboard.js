import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRootNavigationState } from 'expo-router';
import { useAssets } from 'expo-asset';
import { useRouter } from "expo-router";
import AutocompleteInput from "./AutocompleteInput";
import * as SecureStore from 'expo-secure-store';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DATABASE } from './../fireabase';
import { Avatar, Button, Card, Text, List } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import MenuList from './MenuList';
import Pickup from '../app/pickup';
import Confirmation from '../app/confirmation';
import Booking from '../app/booking';
import { useRef } from 'react';

const Stack = createStackNavigator();

const LeftContent = props => <Avatar.Icon {...props} icon="clipboard-list-outline" />
const style = require('../app/styles');

function DashboardComponent({navigation}) {
  const [assets, error] = useAssets([require('../assets/EzDriveLogo.png')]); //get local assets
  const [userId, setUserId] = useState(null); // mock customer
  const [userType, setUserType] = useState(null); // mock customer
  const [destination, setDestination] = useState(null); // customer destination
  const [listOfPlace, setListOfPlace] = useState([]); // autocompelte data from Autocomplete component
  const [booking, setBooking] = useState(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const currentBooking = useRef(null)

  const bookARide = (destinationInformation) => {
    navigation.navigate('Pickup', {
      lon: destinationInformation?.lon,
      lat: destinationInformation?.lat,
      name: destinationInformation?.name
    })
  }

  const routeToBookingDetails = (bookingId) => {
    navigation.navigate('BookingView', {
      userBookingId: bookingId,
      userType: userType,
      uid: userId
    })
    router.setParams()
  }
  
  const selectPlace = (query) => {
    const selectedPlace = listOfPlace.find(x => x.name == query.name);
    setDestination(selectedPlace);
    setListOfPlace([]);
    bookARide(selectedPlace);
  }

  const autocompleteData = (data) => {
    setListOfPlace(data);
    setDataUpdated(true);
  }

  const getBookingByUserId = async (id) => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'bookings', id);
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
      console.log('error booking user Id');
      console.error(error);
    }
  };

  const getAllBookings = async () => {
    const bookingsRef = collection(FIREBASE_DATABASE, 'bookings')
    const bookings = [];
    setBooking([]);
    const bookingSubscription = onSnapshot(bookingsRef, {
      next: (result) => {
        result.docs.forEach((doc) => {
          if (doc.data().status == 'searching') {
            bookings.push(doc.data());
          }
          if (doc.data().status == 'accepted' && doc.data().accepted_by == userId) {
            currentBooking.current = doc.data();
          }

        });
        setBooking(bookings);
      }
    })
  };

  const getUserRole = async (id) => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'user_role', id);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        // Use the retrieved data as needed
        if (data.role == 'employee') router.replace("/login");
        setUserType(data.role);
      }
    } catch (error) {
      // Handle any errors that occur during the data retrieval
      console.log('error user role');
      console.error(error);
    }
  };
  
  async function getValueFor() {
    let authUserId = await SecureStore.getItemAsync('authId');

    // if user is not logged in
    // redirect them to /login
    if (!authUserId) {
      return router.replace("/login");
    }

    setUserId(authUserId);

    await getUserRole(authUserId);
    if (userType == 'customer') await getBookingByUserId(userId);
    if (userType == 'driver') await getAllBookings();
  }

  useEffect(() => {
    if (!navigationState?.key) return; // check if the nav state is ready

    // get auth to local storage
    getValueFor();

    // if logged in
    // check if user is a driver or customer
  },[userId, userType, navigationState?.key])


  return (
    <View>
      <MenuList />
      {userType == 'customer' && (
        <View>
          <Card style={styles.card_container}>
            <Card.Title title="Book a ride" left={LeftContent} />
            <Card.Content>
              <View style={styles.autocomplete_input}>
                <AutocompleteInput autocompleteData={autocompleteData} destination={destination} messageLabel={'Where to?'}  />
              </View>
              <View>
                {booking && (
                  <Button 
                    style={styles.car_button} 
                    mode='outlined' 
                    buttonColor='#50C878' 
                    icon='arrow-right' 
                    textColor='#ffffff' 
                    contentStyle={{flexDirection: 'row-reverse'}}
                    onPress={() => routeToBookingDetails(booking.userId)}
                  >
                    <Text style={{color: '#ffffff'}} variant='labelSmall'>Ongoing: {booking.destination}</Text>
                  </Button>
                )}
                {!booking && (
                  <List.Section>
                  {listOfPlace?.map((place, index) => {
                    return (
                      <List.Item 
                        title={place.name}
                        left={() => <List.Icon icon="map-marker" />} 
                        right={() => <List.Icon icon="arrow-right" />}  
                        key={index}
                        onPress={() => selectPlace(place)}
                      />
                    )
                  })}
                </List.Section>
                )}
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.card_other}>
            <Card.Title title="Ride to Saved Places"/>
            <Card.Content>
              <Text variant='labelLarge'>Home | Office | Popular Place</Text>
            </Card.Content>
          </Card>
        </View>
      )}

      {userType == 'driver' && (
        <View>
          <Card style={styles.card_container}>
            <Card.Title title="Book List" left={LeftContent} />
            <Card.Content style={styles.card_wrapper}>
              <ScrollView>
                {!currentBooking.current && (
                  <List.Section>
                    {booking?.map((place, index) => {
                      return (
                        <Card key={index} style={styles.card_list_container}>
                          <Card.Title title={`From: ${place.origin}`} subtitle={`To: ${place.destination}`} left={LeftContent} />
                          <Card.Content>
                            <Text variant="titleSmall">ETA: </Text>
                            <Text variant="labelSmall">{place.duration}</Text>
                            <Text variant="titleSmall" style={style.m_10}>Fare: </Text>
                            <Text variant="labelSmall">Php {place.fare}</Text>
                          </Card.Content>
                          <Card.Actions>
                            <Button onPress={() => routeToBookingDetails(place.userId)}>View</Button>
                          </Card.Actions>
                        </Card>
                      )
                    })}
                  </List.Section>
                )}
                {currentBooking.current && (
                  <Button 
                      style={styles.car_button} 
                      mode='outlined' 
                      buttonColor='#50C878' 
                      icon='arrow-right' 
                      textColor='#ffffff' 
                      contentStyle={{flexDirection: 'row-reverse'}}
                      onPress={() => routeToBookingDetails(currentBooking.current.userId)}
                    >
                      <Text style={{color: '#ffffff'}} variant='labelSmall'>Ongoing: {currentBooking?.current?.destination}</Text>
                  </Button>
                )}

              </ScrollView>
            </Card.Content>
          </Card>
          <Card style={styles.card_other}>
            <Card.Title title="Ride to Saved Places"/>
            <Card.Content>
              <Text variant='labelLarge'>Home | Office | Popular Place</Text>
            </Card.Content>
          </Card>
        </View>
      )}


    </View>
  )
}

// Component style list
const styles = StyleSheet.create({
  card_container: {
    height: '100%', 
    position: 'relative',
    backgroundColor:'#FFFAD7'
  },
  button_action: {
    width: 250,
    height: 70,
    textAlign: "center",
    paddingLeft: 50
  },
  card_list_container: {
    margin: 10,
  },
  autocomplete_input: {
    height: 50,
    marginTop: 10
  },
  list_text: {
    height: 30, 
    padding: 1
  },
  sticky_modal: {
    flex: 1,
    position: 'absolute', 
    bottom: '50%',
    height: 50,
    width: 250, 
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    zIndex: 15
  },
  card_rides: {
    width: 250, 
    flex: 1,
    backgroundColor: 'white', 
    borderRadius: 5,
    marginTop: 10,
    padding: 10
  },
  card_other: {
    position: 'absolute', 
    bottom: '20%', 
    zIndex: 5, 
    height: 160, 
    width: '100%', 
    borderTopWidth: 1,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    backgroundColor:'#FFE4A7'
  },
  car_button: {
    borderRadius: 5, 
    marginTop: 5
  },
  card_wrapper: {
    height: 500
  },
})

const Dashboard = () => {
  return (
    <Stack.Navigator initialRouteName='Dashboard'>
      <Stack.Screen options={{
        header: () => {<MenuList title={"Title"}/>},
      }} name="Dashboard" component={DashboardComponent} />
      <Stack.Screen name="Pickup" component={Pickup} options={{
        headerStyle:{
          backgroundColor:'#FFE4A7'}}}/>
      <Stack.Screen name="Confirmation" component={Confirmation} options={{
        headerStyle:{
          backgroundColor:'#FFE4A7'}}}/>
      <Stack.Screen name="BookingView" component={Booking} options={{
        headerStyle:{
          backgroundColor:'#FFE4A7'}}}/>
    </Stack.Navigator>
  );
}

export default Dashboard