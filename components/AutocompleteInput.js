import { StyleSheet, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import Autocomplete from 'react-native-autocomplete-input';
import debounce from 'lodash.debounce'

const AutocompleteInput = (props) => {
  const [locationState, setLocationState] = useState([]);
  const [locationValue, setLocationValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const API_URL = `https://api.locationiq.com/v1/autocomplete?key=pk.e20feeddc5a5c8c771bf9bceef36587f&countrycodes=PH&q=`;
  const callBack = useCallback(debounce(async query => {
    setLocationValue(query);
    fetchLocation(query);
  }, 1000), []);
  let data = [];

  // fetch location via locationiq
  // alternative for googlemaps since googlemaps need creditcard to use the free tier
  fetchLocation = async (query) => {
    if (query == '' || query == null) return [];

    try {
      let response = await fetch(`${API_URL}${query}`);

      let json = await response.json();
      const newData = json.map(x => {
        return {
          name: x.display_name,
          lon: x.lon,
          lat: x.lat
        }
      })
      setLocationState(newData);
      props.autocompleteData(newData);
    } catch (error) {
      return data;
    }
    return data;
  }

  // set location when the user selected a place via text box
  useEffect(() => {
    setSelectedLocation(props.destination?.name);
  }, [])


  return (
    <View style={styles.autocompleteContainer}>
        <Autocomplete 
            style={styles.autocompleteInner}
            data={locationState}
            onChangeText={callBack}
            defaultValue={selectedLocation}
            placeholder={props.messageLabel}
            hideResults={true}
      />
    </View>
  )
}

export default AutocompleteInput

// Component style list
const styles = StyleSheet.create({
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1,
      borderWidth: 0
    },
    autocompleteInner: {
      borderColor: "#ffffff",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 5
    }
  });