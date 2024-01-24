import { View, StyleSheet, Keyboard } from "react-native";
import MapNavigation from "../../components/MapNavigation";
import React, { useEffect, useState } from 'react'
import AutocompleteInput from "../../components/AutocompleteInput";
import * as SecureStore from 'expo-secure-store';
import { List, Card, Button } from 'react-native-paper';
const style = require('../styles');

const Pickup = ({ route, navigation }) => {
  const { lon, lat, name } = route.params;
  // const { lon, lat, destinationName } = useLocalSearchParams(); // props data
  const [destination, setDestination ] = useState({
    lon: parseFloat(lon),
    lat: parseFloat(lat),
    name: null
  });
  const [origin, setOrigin] = useState(null)
  const [listOfPlace, setListOfPlace] = useState([]); // autocompelte data from Autocomplete component
  const [dataUpdated, setDataUpdated] = useState(false) // props to update
  const [isSelecting, setIsSelecting] = useState(false) // props to update
  // // User info
  const [email, setEmail] = useState(null)
  const [userUUID, setUserUUID] = useState(null)

  useEffect(() => {
    setDestination({
      lon: parseFloat(lon),
      lat: parseFloat(lat),
      name: name
    })
    setUserValue();
  },[lon, lat])

  const selectPlace = (query) => {
    const selectedPlace = listOfPlace.find(x => x.name == query.name);
    setOrigin({
      lon: selectedPlace.lon,
      lat: selectedPlace.lat,
      name: selectedPlace.name
    });
    setListOfPlace([]);
    setIsSelecting(false);
  }

  const autocompleteData = (data) => {
    setListOfPlace(data);
    setDataUpdated(true);
    setIsSelecting(true)
  }

  setPickupPoint = () => {
    Keyboard.dismiss();
    navigation.navigate('Confirmation', {
      originalLon: origin.lon, 
      originalLat: origin.lat, 
      destinationLon: destination.lon, 
      destinationLat: destination.lat, 
      originName: origin.name,
      destinationName: destination.name,
    })
  }

  async function setUserValue() {
    let email = await SecureStore.getItemAsync('auth');
    let userUUID = await SecureStore.getItemAsync('authId');
    setEmail(email);
    setUserUUID(userUUID)
  }

  const etaInformation = (information) => {
  }

  return (
    <View style={style.main}>
      <View style={style.is_flex}>
        <View style={style.is_flex_h_half}>
          <MapNavigation destination={destination} origin={origin} etaInformation={etaInformation} />
        </View>
        <View style={style.is_flex_h_half}>
          <Card style={style.is_flex_h_half}>
            <Card.Title title="Book a ride" />
            <Card.Content>
              <View style={styles.autocomplete_input}>
                <AutocompleteInput autocompleteData={autocompleteData} destination={destination} messageLabel={'Where to?'}  />
              </View>
              <View style={{marginTop:10}}>
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
              </View>
            </Card.Content>
            <Card.Actions>
              <Button disabled={!origin} style={style.w_full} onPress={() => setPickupPoint()}>Set pickup point</Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  autocomplete_input: {
    height: 50,
    marginTop: 5
  }
})
export default Pickup;