import {
    StyleSheet
} from 'react-native';
import * as defaultStyle from '../style';

export default function getStyle(theme = {}) {
    const appStyle = { ...defaultStyle,
        ...theme
    };
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: appStyle.calendarBackground
        },
        week: {
            paddingTop: 10,
            paddingBottom: 20,
            flexDirection: 'row',
            // justifyContent: 'space-around',
            alignItems: 'flex-start',
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
        },
        weekBottom: {
            borderBottomWidth: 0
        },
        weeks: {
            paddingLeft: 16,
            paddingRight: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            height: '100%'
        },
        weekDayNames: {
            marginTop: 7,
            paddingLeft: 16,
            paddingRight: 16,
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        dayHeader: {
            marginTop: 2,
            marginBottom: 7,
            width: 32,
            textAlign: 'center',
            fontSize: appStyle.textDayHeaderFontSize,
            fontFamily: appStyle.textDayHeaderFontFamily,
            color: appStyle.textSectionTitleColor
        },
        dayHeaderWeekend: {
            color: appStyle.textDayHeaderWeekendColor,
        },
        indicator: {
            zIndex: 100,
            elevation: 1,
            position: 'absolute',
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
        },
        indicatorWrapper: {
            backgroundColor: 'rgba(231,76,60,1)',
            borderRadius: 26,
            padding: 5
        },
    });
}
