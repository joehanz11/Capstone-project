import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Appbar, Menu, Divider, ActivityIndicator, MD2Colors, Text} from 'react-native-paper';
import { useRouter } from "expo-router";
import { authSignout } from '../fireabase';



export default function MenuList() {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // get data from local storage
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setUser(result)
    }
  }


  // remove data from local storage
  async function removeValueFor() {
    await SecureStore.deleteItemAsync('auth');
    await SecureStore.deleteItemAsync('authId');
    await authSignout();
    setIsLoading(false)
    router.replace("/login");
  }

  const logout = async () => {
    setIsLoading(true);
    setVisible(false);
    await removeValueFor();
  };

  useEffect(() => {
    getValueFor('auth');
  },[user])

  return (
    <Appbar.Header style={{backgroundColor: '#FFE4A7'}}>
      <Appbar.Content title='Dashboard' />
      {isLoading && (
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
      )}
      {!isLoading && (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action onPress={openMenu} icon="face-man-profile" />
          }>
          <Menu.Item onPress={() => {}} title="Profile" />
          <Menu.Item onPress={logout} title="Logout" />
          <Divider />
        </Menu>
      )}        
  </Appbar.Header>
  );
}