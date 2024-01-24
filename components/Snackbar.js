import {React, useEffect, useState} from "react";
import { View, StyleSheet} from "react-native";
import { Snackbar } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
const style = require('../app/styles');


export default function AppSnack() {
  const [shouldShow, setShouldShow] = useState(true);
  const [snackMsg, setSnackMsg] = useState('')
  const hideSnack = () => setShouldShow(false);
  const showSnack = () => setShouldShow(true);
  const [counter, setCounter] = useState(1)

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result && counter == 1) {
      setSnackMsg(result)
      setShouldShow(true)
      setCounter(counter+1)

    }
  }

  useEffect(() => {
    getValueFor('auth');
  })

  return(
    <SafeAreaView>
      <View>
        {shouldShow ? ( 
          <Snackbar
            message={ `${snackMsg} Succesfull`}
            style={{ position: "absolute", start: 16, end: 16, bottom: 16 }}
            action={(
            <SimpleLineIcons.Button name="close" color="black" backgroundColor={"#FFCDA8"} onPress={hideSnack}>
              Close
            </SimpleLineIcons.Button>)}
          />
        ):null}
      </View>
    </SafeAreaView>
    
    
    
  );
};