import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      flex: 1,
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      paddingTop: 10,
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0'
    },
    weekBottom: {
        borderBottomWidth: 0
    },
    weeks: {
      paddingLeft: 16,
      paddingRight: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0'
    }
  });
}
