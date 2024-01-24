import { View } from "react-native";
import Login from "../../components/Login";
const style = require('../styles');

export default function Index() {
  return (
    <View style={style.theme_wrapper}>
      <Login/>
    </View>
  );
}