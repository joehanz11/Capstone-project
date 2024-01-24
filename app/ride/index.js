import { View  } from 'react-native'
import BookingView from '../../components/BookingView';
const style = require('../styles');

export default function Index() {
  return (
    <View style={style.theme_wrapper}>
      <BookingView />
    </View>
  )
}