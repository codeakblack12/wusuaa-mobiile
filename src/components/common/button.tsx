import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Spinner } from './Spinner';
import { BaseText } from './text';
import { colors } from '../../utils/colors';
import { hp, wp, fontSz } from '../../utils/constants';
import Fonts from '../../utils/fonts';

interface CustomButtonProps {
    onPress?: any;
    disabled?: boolean;
    loading?: boolean;
    buttonStyle?: any;
    onPressOut?: any;
    onPressIn?: any;
    onLongPress?: any;
    spinnerColor?: String;
    textStyle?: any;
    buttonText?: String;
    buttonIcon?: SVGElement;
}

const BaseButton: React.FC<CustomButtonProps> = ({
    onPress,
    disabled,
    buttonStyle,
    onPressOut,
    onPressIn,
    onLongPress,
    loading,
    spinnerColor,
    textStyle,
    buttonText,
    buttonIcon,
}) => {
    const {
        containerStyle,
        touchableContainerStyle,
        contentContainer,
        disabledStyles,
        buttonTextStyles
    } = styles;

    const buttonDisabled = disabled || loading ? true : false;
    const buttonDisabledStyle = disabled || loading ? disabledStyles : '';

    const renderSpinnerOrText = () => {
        const color = spinnerColor ? spinnerColor : colors.white;
        if (loading) {
          return <Spinner color={color} size={20} />;
        }
        return(
          <View style={styles.buttonWrp}>
            {buttonIcon && <View>{buttonIcon}</View>}
            <BaseText
              style={[
                buttonTextStyles,
                textStyle
              ]}>
                {buttonText}
            </BaseText>
          </View>
        );
    }

    return (
        <View style={containerStyle}>
          <TouchableOpacity
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onLongPress={onLongPress}
              disabled={buttonDisabled}
              style={[
                  touchableContainerStyle,
                  buttonDisabledStyle,
                  buttonStyle
              ]}>
              <View style={contentContainer}>
                  {renderSpinnerOrText()}
              </View>
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    containerStyle: {
    },
    touchableContainerStyle: {
      justifyContent:'center',
      borderRadius: hp(5),
      backgroundColor: colors.black,
      height: hp(56)
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonWrp: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(24)
    },
    buttonTextStyles: {
      fontSize: fontSz(16),
      fontFamily: Fonts.Bold,
    //   textTransform: 'uppercase',
      color: colors.white,
      flex: 1,
      alignSelf: 'center',
      textAlign: 'center',
    },
    disabledStyles: {
      backgroundColor: colors.btnDisabled,
    //   opacity: 0.7
    },
});

export { BaseButton };