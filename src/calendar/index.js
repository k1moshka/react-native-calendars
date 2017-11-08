import React, {
    Component
} from 'react';
import {
    View,
    ViewPropTypes,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

import XDate from 'xdate';
import dateutils, { weekDayNames } from '../dateutils';
import {
    xdateToData,
    parseDate
} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/interactive';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
import Swiper from './swiper/Swiper';

//Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

class Calendar extends Component {
    static propTypes = {
        // Specify theme properties to override specific styles for calendar parts. Default = {}
        theme: PropTypes.object,
        // Collection of dates that have to be marked. Default = {}
        markedDates: PropTypes.object,

        // Specify style for calendar container element. Default = {}
        style: viewPropTypes.style,

        selected: PropTypes.array,

        // Initially visible month. Default = Date()
        current: PropTypes.any,
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate: PropTypes.any,
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        maxDate: PropTypes.any,

        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay: PropTypes.number,

        // Date marking style [simple/interactive]. Default = 'simple'
        markingType: PropTypes.string,

        // Hide month navigation arrows. Default = false
        hideArrows: PropTypes.bool,
        // Display loading indicador. Default = false
        displayLoadingIndicator: PropTypes.bool,
        // Do not show days of other months in month page. Default = false
        hideExtraDays: PropTypes.bool,

        // Handler which gets executed on day press. Default = undefined
        onDayPress: PropTypes.func,
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange: PropTypes.func,
        onVisibleMonthsChange: PropTypes.func,
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        renderArrow: PropTypes.func,
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.style = styleConstructor(this.props.theme);
        let currentMonth;
        if (props.current) {
            currentMonth = parseDate(props.current);
        } else {
            currentMonth = props.selected && props.selected[0] ? parseDate(props.selected[0]) : XDate();
        }
        this.state = {
            currentMonth
        };

        this.updateMonth = this.updateMonth.bind(this);
        this.addMonth = this.addMonth.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate;
    }

    componentWillReceiveProps(nextProps) {
        const current = parseDate(nextProps.current);
        if (current && current.toString('yyyy MM') !== this.state.currentMonth.toString('yyyy MM')) {
            this.setState({
                currentMonth: current.clone()
            });
        }
    }

    pressDay(day) {
        const minDate = parseDate(this.props.minDate);
        const maxDate = parseDate(this.props.maxDate);
        if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
            this.updateMonth(day);
            if (this.props.onDayPress) {
                this.props.onDayPress(xdateToData(day));
            }
        }
    }

    addMonth(count, isFromArrow = false) {
        if (isFromArrow) {
            this.refs.swiper.change(count === -1);
        } else {
            this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
        }
    }

    isSelected(day) {
        let selectedDays = [];
        if (this.props.selected) {
            selectedDays = this.props.selected;
        }
        for (let i = 0; i < selectedDays.length; i++) {
            if (dateutils.sameDate(day, parseDate(selectedDays[i]))) {
                return true;
            }
        }
        return false;
    }

    getDateMarking(day) {
        if (!this.props.markedDates) {
            return false;
        }
        const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || [];
        if (dates.length || dates) {
            return dates;
        } else {
            return false;
        }
    }

    updateMonth(day, doNotTriggerListeners) {
        if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
            return;
        }
        this.setState({
            currentMonth: day.clone()
        }, () => {
            if (!doNotTriggerListeners) {
                const currMont = this.state.currentMonth.clone();
                if (this.props.onMonthChange) {
                    this.props.onMonthChange(xdateToData(currMont));
                }
                if (this.props.onVisibleMonthsChange) {
                    this.props.onVisibleMonthsChange([xdateToData(currMont)]);
                }
            }
        });
    }

    renderDay(day, id, monthOffset = 0) {
        const minDate = parseDate(this.props.minDate);
        const maxDate = parseDate(this.props.maxDate);
        const currentMonth = this.state.currentMonth.clone().addMonths(monthOffset);
        let state = '';
        if (this.isSelected(day)) {
            state = 'selected';
        } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
            state = 'disabled';
        } else if (!dateutils.sameMonth(day, currentMonth)) {
            state = 'disabled';
        } else if (dateutils.sameDate(day, XDate())) {
            state = 'today';
        }
        let dayComp;
        if (!dateutils.sameMonth(day, currentMonth) && this.props.hideExtraDays) {
            if (this.props.markingType === 'interactive') {
                dayComp = (<View key={id} style={{flex: 1}} />);
            } else {
                dayComp = (<View key={id} style={{width: 32}} />);
            }
        } else {
            const DayComp = this.props.markingType === 'interactive' ? UnitDay : Day;
            const markingExists = this.props.markedDates ? true : false;
            dayComp = (
                <DayComp
                    key={id}
                    state={state}
                    theme={this.props.theme}
                    day={day}
                    onPress={this.pressDay.bind(this, day)}
                    marked={this.getDateMarking(day)}
                    markingExists={markingExists}
                >
                    {day.getDate()}
                </DayComp>
            );
        }
        return dayComp;
    }

    renderWeekDays() {
        const weekDaysNames = weekDayNames(this.props.firstDay);
        return (
            <View style={this.style.weekDayNames} key="weekdays">
                {
                    weekDaysNames.map((day, idx) => {
                        const dayOfWeek = (idx + this.props.firstDay) % 7,
                            isWeekEnd = dayOfWeek === 6 || dayOfWeek === 0,
                            style = isWeekEnd
                                ? [this.style.dayHeader, this.style.dayHeaderWeekend]
                                : this.style.dayHeader;

                        return (
                            <Text key={idx} style={style}>{day}</Text>
                        );
                    })
                }
            </View>
        );
    }

    renderWeek(days, id, isLast, monthOffset = 0) {
        const week = [],
            style = isLast
                ? [this.style.week, this.style.weekBottom]
                : this.style.week;
        days.forEach((day, id2) => {
            week.push(this.renderDay(day, id2, monthOffset));
        }, this);

        return (
            <View style={style} key={id}>
                {week}
            </View>
        );
    }

    renderContent = (offset = 0) => () => {
        const month = this.state.currentMonth.clone().addMonths(offset, false);
        const days = dateutils.page(month, this.props.firstDay);
        const weeks = [];
        while (days.length) {
            const isLast = days.length <= 7;
            weeks.push(this.renderWeek(days.splice(0, 7), weeks.length, isLast, offset));
        }

        return (
            [
                this.renderWeekDays(),
                <View style={this.style.weeks} key="weeks">
                    {weeks}
                </View>
            ]
        );
    }

    render() {
        let indicator;
        const current = parseDate(this.props.current);
        if (current) {
            const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
            if (this.props.displayLoadingIndicator &&
                !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
                indicator = true;
            }
        }

        return (
            <View style={[this.style.container, this.props.style]}>
                <CalendarHeader
                    theme={this.props.theme}
                    hideArrows={this.props.hideArrows}
                    month={this.state.currentMonth}
                    addMonth={this.addMonth}
                    showIndicator={indicator}
                    firstDay={this.props.firstDay}
                    renderArrow={this.props.renderArrow}
                    monthFormat={this.props.monthFormat}
                    animationDuration={350}
                />
                <Swiper
                    ref="swiper"
                    successCapture={0.4}
                    animationDuration={450}
                    renderLeft={this.renderContent(-1)}
                    renderCenter={this.renderContent()}
                    renderRight={this.renderContent(1)}
                    onChangePage={(toLeft) => this.addMonth(toLeft ? -1 : 1)}
                />
            </View>
        );
    }
}

export default Calendar;
