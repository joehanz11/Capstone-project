import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SimpleLineIcons } from '@expo/vector-icons';

const UserProfile = ({ user }) => {
  const [fullName, setFullName] = React.useState('Full Name');
  const [userName, setUserName] = React.useState('Username');
  const [city, setCity] = React.useState('City');
  const [address, setAddress] = React.useState('Address');
  const [postal, setPostal] = React.useState('Postal');
  const [id, setId] = React.useState('Id');
  //const [avatar, setAvatar] = useState(user.avatar);

  return (
    <SafeAreaView>
      <View style={styles.border}>
        <Text style={styles.display}>
        {fullName}
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setUserName}
          value={userName}
        />
        <Text style={styles.display}>
        {city}
        </Text>
        <Text style={styles.display}>
        {address}
        </Text>
        <Text style={styles.display}>
        {postal}
        </Text>
        <Text style={styles.display}>
        {id}
        </Text>
        <View style={styles.btn}>
          <SimpleLineIcons.Button name="arrow-left" backgroundColor="#248bf2" color="black" href="/">
            Back
          </SimpleLineIcons.Button>
        </View>
      </View>
       
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  border:{
    padding: 20,
    border: "2px Solid Black",
    borderRadius: "20px"
  },
  input: {
    height: 40,
    margin: 7,
    width: 250,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  display:{
    height: 40,
    margin: 7,
    width: 250,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: "#636363",
    backgroundColor: "#ffffff",
    fontWeight: "Bold"
  },
  btn: {
    margin: 2,
  },
});

export default UserProfile
