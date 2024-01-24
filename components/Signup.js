import { View, TextInput, StyleSheet, Text, ScrollView} from 'react-native';
import React from 'react';
import {Checkbox, Modal, Button, PaperProvider} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, FIREBASE_DATABASE  } from '../fireabase';
import { Link, useRouter } from "expo-router";
import { collection, doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
const style = require('../app/styles');

const Signup = () => {
  const [role, setRole] = React.useState('customer');
  const [fullName, setFullName] = React.useState('Full Name');
  const [userName, setUserName] = React.useState('Username');
  const [password, setPassword] = React.useState('Password');
  const [city, setCity] = React.useState('City');
  const [address, setAddress] = React.useState('Address');
  const [postal, setPostal] = React.useState('Postal');
  const [id, setId] = React.useState('Id');
  const [email, setEmail] = React.useState(null);
  const router = useRouter();
  const collectionRef = collection(FIREBASE_DATABASE, 'user_role');
  const [checked, setChecked] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20, height: 400, borderWidth:1, width:250};

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(credentials => {
      const user = credentials.user;
      const addUser = {
        role: role,
        userId: user.uid,
        displayName: user.email,
        status: 'unverified'
      }
      addDataWithCustomId(user.uid, addUser);
      router.replace("/login");
    })
    .catch(error => alert(error.message));      
  }

  const addDataWithCustomId = async (id, data) => {
    try {
      const docRef = doc(FIREBASE_DATABASE, 'user_role', id);
      await setDoc(docRef, data);
    } catch (error) {
      // Handle any errors that occur during data addition
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={{marginTop:150}}>
        <Text style={{fontWeight:'bold', fontSize:30}}>Create Account </Text>
      </View>    
      <View style={styles.picker}>
        <Picker
          style={{ }}
          selectedValue={role}
          onValueChange={(itemValue, itemIndex) =>
            setRole(itemValue)
          }>
  
          <Picker.Item label="I'm a user" value="customer" />
          <Picker.Item label="I'm a driver" value="driver" />
        </Picker>
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
          placeholder='Password'
          secureTextEntry={true}      
          />
        </View>
        {/* TODO: Add sa database */}
        {/* <TextInput
          style={styles.input}
          onChangeText={setFullName}
          placeholder='Full Name'
        />
        <TextInput
          style={styles.input}
          onChangeText={setUserName}
          placeholder='Username'
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          placeholder='Password'
          secureTextEntry={true}
          
        />
        <TextInput
          style={styles.input}
          onChangeText={setCity}
          placeholder='City'
        />
        <TextInput
          style={styles.input}
          onChangeText={setAddress}
          placeholder='Address'
        />
        <TextInput
          style={styles.input}
          onChangeText={setPostal}
          placeholder='Postal'
        />
        <TextInput
          style={styles.input}
          onChangeText={setId}
          placeholder='Id'
        /> */}

        <View style={style.CheckBoxContainer}>
          <Checkbox
            status={checked ? 'unchecked' : 'checked'}
            onPress={() => {
            setChecked(!checked);
            }}
          />
          <Text>I agree to the <Link href='/signup' onPress={showModal} style={styles.link_action}> Terms and Conditions</Link> policy</Text>
        </View>

        <View style={style.m_10}>
            <LinearGradient
              style={style.action_container}
              colors={['#FFE4A7','#FF2171']}
              start={{x:0, y:-5}}
              end={{x:1, y:5}}
            >
              <SimpleLineIcons.Button disabled={checked} name="lock" onPress={signup} color='white' backgroundColor={null}>
                Sign Up
              </SimpleLineIcons.Button>
            </LinearGradient>
        </View>
      <View style={style.bottom}>
          <Text style={{color:'#838180'}}>Already have an account?: <Link style={styles.link_action} href="/login">Login</Link> </Text>
        </View>
        <PaperProvider>
          <View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <ScrollView>
          <Text>Terms and Conditions
            {"\n"}1.The Customer agrees that these Terms and Conditions shall apply when the Customer contacts through the Ezdrive Booking App or otherwise to book and/or utilize its ride-hailing services.
            {"\n"}2.The company shall not be responsible nor liable for any loss, damage, cost or embarrassment suffered by the Customer in relation to the use of Ezdrive booking app arising from or attributable to (i) any act or omission of the Customer, or any instructions or operations affected by the Customer or purported to be affected by the Customer howsoever caused including but not limited to the Customer’s non-compliance with any written or recorded voice instructions or information issued by the company; and (ii) Taxi’s inability to provide the services for any reason, including and without limitation, as a result of malfunction, partial or total failure of any network terminal, data processing system, computer teletransmission or telecommunications system or other circumstances whether or not beyond the control of any person or any organization involved in the above mentioned systems.
            {"\n"}3.The Customer undertakes with RLC Taxi and agrees to indemnify RLC Taxi from and against and in respect of any or all liabilities, losses, charges and expenses (including legal fees and costs on a full indemnity basis) claims, demands, actions and proceedings which RLC Taxi may incur or sustain directly or indirectly from or by any reason of or in relation to the Customer’s use or proposed use of ride-hailing services and shall pay such sums on demand.
            {"\n"}4.The Customer shall not hold RLC Taxi liable for the use of location based information provided by any of the telecommunication companies when the Customer uses the mobile phone to make a booking. The location based information will be used only to facilitate and improve the probability of locating a vehicle for the Customer.
            {"\n"}5.The Customer consents to the collection, use and disclosure of Personal Data and these Terms and Conditions. In addition, RLC Taxi may use your Personal Data for the purposes of communicating or marketing promotions, products or services of RLC Taxi and/or its business partners. We may communicate marketing materials and transactional messages to you by the following ways: telephone call, Short Message Service (SMS),
              push notification via the Ezdrive booking app, post, and by electronic mail (e-mail).
            {"\n"}6.For the cancellation of booking no fee charge to the customers. But, if you cancel 3 or more times, your account will be suspended for 3 days before you will be able to make another booking again. If your driver asked you to cancel the ride, you are under no obligation to do so.
            {"\n"}7.The Customer may choose to pay for his/her fares via the approved payment methods made available on the Ezdrive Booking App and/or other approved payment methods on board the taxi, where applicable. When the Customer elects to pay through the payment methods within the Ezdrive Booking App, he/she will be required to have registered or paired his/her designated payment method to the Ezdrive Booking App, and select the payment method within the Ezdrive Booking App at the point of making the booking or when the Customer elects to use the “Pay for Street Hail” feature in the Booking App. Once the trip is completed, the fare for the trip will be charged to the said designated payment method for the booking or street hail.
          </Text>
        </ScrollView>
        </Modal>
        </View>
        </PaperProvider>
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'white', 
    borderWidth: 2, 
    borderColor: 'black',
    borderRadius: 5,
  },
  link_action:{
    color: '#FF2171',
  }
});

export default Signup
