import React, {
    Component
} from 'react';
import {
    ActivityIndicator
} from 'react-native';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {
    weekDayNames
} from '../../dateutils';

class CalendarHeader extends Component {
    static propTypes = {
        theme: PropTypes.object,
        hideArrows: PropTypes.bool,
        month: PropTypes.instanceOf(XDate),
        addMonth: PropTypes.func,
        showIndicator: PropTypes.bool,
        firstDay: PropTypes.number,
        renderArrow: PropTypes.func,
        animationDuration: PropTypes.number
    };

    static defaultProps = {
        animationDuration: 400
    }

    constructor(props) {
        super(props);
        this.style = styleConstructor(props.theme);
        this.addMonth = this.addMonth.bind(this);
        this.substractMonth = this.substractMonth.bind(this);
    }

    state = {
        fadeAnim: new Animated.Value(0),
        month: this.props.month
    }

    componentWillMount() {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: this.props.animationDuration
            }
        ).start();
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.month.toString('yyyy MM') !==
            this.props.month.toString('yyyy MM')
        ) {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => {
                this.setState({
                    month: nextProps.month
                });
            }, this.props.animationDuration);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.month.toString('yyyy MM') !==
            this.props.month.toString('yyyy MM')
        ) {
            return true;
        }
        if (nextProps.showIndicator !== this.props.showIndicator) {
            return true;
        }
        if (nextState.month !== this.state.month) {
            return true;
        }
        return false;
    }

    componentWillUpdate(nextProps) {
        const monthChanged = nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM');

        if (monthChanged) {
            Animated.sequence([
                Animated.timing(
                    this.state.fadeAnim,
                    {
                        toValue: 0,
                        duration: this.props.animationDuration,
                    }
                ),
                Animated.timing(
                    this.state.fadeAnim,
                    {
                        toValue: 1,
                        duration: this.props.animationDuration,
                    }
                )
            ]).start();
        }
    }

    addMonth() {
        this.props.addMonth(1, true);
    }

    substractMonth() {
        this.props.addMonth(-1, true);
    }

    render() {
        let leftArrow = <View />;
        let rightArrow = <View />;
        let weekDaysNames = weekDayNames(this.props.firstDay);
        if (!this.props.hideArrows) {
            leftArrow = (
                <TouchableOpacity
                    onPress={this.substractMonth}
                    style={this.style.arrow}
                >
                    {
                        this.props.renderArrow
                            ? this.props.renderArrow('left')
                            : <Image
                                source={require('../img/previous.png')}
                                style={this.style.arrowImage}
                            />
                    }
                </TouchableOpacity>
            );
            rightArrow = (
                <TouchableOpacity onPress={this.addMonth} style={this.style.arrow}>
                    {
                        this.props.renderArrow
                            ? this.props.renderArrow('right')
                            : <Image
                                source={require('../img/next.png')}
                                style={this.style.arrowImage}
                            />
                    }
                </TouchableOpacity>
            );
        }
        let indicator;
        if (this.props.showIndicator) {
            indicator = <ActivityIndicator color="#EE5555" />;
        }
        return (
            <View>
                <View style={this.style.header}>
                    {leftArrow}
                    <Animated.View style={{ flexDirection: 'row', opacity: this.state.fadeAnim }}>
                        <Text style={this.style.monthText}>
                            {
                                this.state.month.toString(
                                    this.props.monthFormat
                                        ? this.props.monthFormat
                                        : 'MMMM yyyy'
                                )
                            }
                        </Text>
                        {indicator}
                    </Animated.View>
                    {rightArrow}
                </View>
            </View>
        );
    }
}

export default CalendarHeader;
