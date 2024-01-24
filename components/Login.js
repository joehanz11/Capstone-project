import { View,  TextInput, StyleSheet, Text} from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from "expo-router";
import { useAssets } from 'expo-asset';
import { auth } from '../fireabase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
const style = require('../app/styles');


const Login = () => {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [assets, error] = useAssets([require('../assets/EzDriveLogo.png')]);
  const router = useRouter();

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async credentials => {
      const user = credentials.user;
      await saveAuth(user);
      router.replace("/");
    })
    .catch(error => alert(error.message));
  };

  async function saveAuth(user) {
    await SecureStore.setItemAsync('auth', user.email);
    await SecureStore.setItemAsync('authId', user.uid);
  }

  const showPassword = () =>{}

  return (
    <SafeAreaView>
    
       <View >
        <View>
          <Image style={style.logo}   source={assets ? assets[0] : null} />
        </View>
        <View>
          <Text style={{fontWeight:'bold', fontSize:50}}>Login </Text>
          <Text style={{color:'#838180'}}> Please Sign in to Continue </Text>
        </View>
        <View style={style.input_container}>
          <MaterialIcons style={style.icon} name="email" size={24}/>
          <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder='Email'
        />
        </View>
        <View style={style.input_container}>
          <SimpleLineIcons style={style.icon} name="lock" size={24}/>
          <TextInput 
          onChangeText={setPassword}
          value={password}
          placeholder='Password'
          secureTextEntry={true}      
          />
        </View>
        
        <View style={style.m_10}>
            <LinearGradient
              style={style.action_container}
              colors={['#FFE4A7','#FF2171']}
              start={{x:0, y:-5}}
              end={{x:1, y:5}}
            >
              <SimpleLineIcons.Button name="login" onPress={login} color='white' backgroundColor={null}>
                Login
              </SimpleLineIcons.Button>
            </LinearGradient>  
        </View>
      </View>
      <View style={style.bottom}>
        <Text style={{color:'#838180'}}>Don't have an account?: <Link style={styles.link_action} href="/signup">Signup</Link> </Text>
      </View>        
    </SafeAreaView>
  )
}

// Component style list
const styles = StyleSheet.create({
  link_action: {
    color:"#FF2171",
  },
});

export default Login