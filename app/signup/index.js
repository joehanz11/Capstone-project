import { View } from "react-native";
import Signup from "../../components/Signup";
const style = require('../styles');

export default function Index() {
  return (
    <View style={style.theme_wrapper}>
      <Signup />
    </View>
  );
}