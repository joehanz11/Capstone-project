import { View } from "react-native";
import Dashboard from "../components/Dashboard";
import React from 'react';
import MenuList from "../components/MenuList";
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './../app.json';
import { AppRegistry } from 'react-native';
const style = require('./styles');

export default function Index() {
  return (
    <PaperProvider>
      <View style={style.main}>
        {/* <View style={style.menu}>
          <MenuList />
        </View> */}
       <Dashboard />

      </View>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);