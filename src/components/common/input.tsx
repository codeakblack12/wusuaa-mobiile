import React, { useRef, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, KeyboardType, ViewStyle, TextStyle } from 'react-native';
import { BaseText } from './text';
import { hp, wp, fontSz, HITSLOP } from '../../utils/constants';
import { colors } from '../../utils/colors';
import Fonts from '../../utils/fonts';
import icons from '../../utils/icons';

interface BaseInputProps {
    placeholder?: string ;
    onChangeText?: Function;
    value?: string;
    label?: string;
    onFocus?: Function;
    onBlur?: Function;
    autoCapitalize?: boolean;
    textInputStyle?: TextStyle;
    onChange?: Function;
    onEndEditing?: Function;
    placeholderColor?: string;
    textAlignVertical?: string;
    multiline?: boolean;
    error?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    icon?: any;
    iconPress?: Function;
    contStyle?: ViewStyle;
    iconStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    keyboard?: KeyboardType
    errorMsg?: string;
    password?: boolean;
    secureTextEntry?: boolean;
    errorIcon?: React.ReactNode;
    onError?: Function;
    errorMessage?: string;
    withIcon?: boolean;
    editable?: boolean;
    onPressOut?: Function
}

const BaseInput: React.FC<BaseInputProps> = ({
    placeholder,
    onChangeText,
    value,
    label,
    onFocus,
    onBlur,
    autoCapitalize,
    textInputStyle,
    onChange,
    onEndEditing,
    placeholderColor,
    textAlignVertical,
    multiline,
    keyboard,
    error,
    autoFocus,
    maxLength,
    icon,
    iconPress,
    contStyle,
    iconStyle,
    containerStyle,
    onError,
    errorIcon,
    errorMessage,
    secureTextEntry,
    password,
    withIcon,
    editable,
    onPressOut
}) => {
    const [secure, setSecure] = useState(true);

    const renderEditable = () => {
        if(editable !== undefined){
          if(editable === true) {
            return true;
          }
          return false;
        }
        return true;
    }

    const handleBlur = () => {
        if(onBlur){
          onBlur()
        }
    }

    const handleFocus = () => {
        onFocus;
    }

    return(
        <>
        <View style={[styles.container, contStyle]}>
            {label && <BaseText style={styles.labelStyle}>{label}</BaseText>}
            <View style={
                [styles.inputArea,
                {
                    backgroundColor: colors.inputBg,
                    borderColor: errorMessage ? "tomato" : colors.border
                },
                containerStyle,
                // {borderColor}
                ]}
            >
            <TextInput
                style={[styles.inputStyle, textInputStyle, {paddingLeft: wp(15)}]}
                onChangeText={onChangeText}
                autoCorrect={false}
                value={value}
                onBlur={() => handleBlur()}
                onFocus={() => handleFocus()}
                onPressOut={onPressOut}
                editable={renderEditable()}
                autoCapitalize={autoCapitalize || 'none'}
                placeholder={placeholder || ''}
                onChange={onChange}
                onEndEditing={onEndEditing}
                keyboardType={keyboard}
                maxLength={maxLength}
                multiline={multiline}
                secureTextEntry={secureTextEntry && secure}
                placeholderTextColor={placeholderColor || colors.border}
                textAlignVertical={textAlignVertical || 'center'}
                // ref={ref => inputRef = ref}
                autoFocus={autoFocus}
            />
            {icon && <View>{icon}</View>}
            {password && !icon &&
            <TouchableOpacity
                hitSlop={HITSLOP}
                style={styles.iconArea}
                onPress={() => setSecure(secure => !secure)}>
                <icons.Feather name={`eye${secure ? "-off" : ""}`} size={wp(20)} color={colors.primaryTxt} />
            </TouchableOpacity>}
            </View>
        </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: hp(24)
    },
    labelStyle: {
      fontSize: fontSz(14),
      marginBottom: hp(10),
    },
    inputArea: {
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: hp(5),
      minHeight: hp(50),
      backgroundColor: colors.white
    },
    inputStyle: {
      flex: 1,
      fontSize: fontSz(14),
      color: colors.black,
      fontFamily: Fonts.Bold,
      height: hp(56)
    },
    iconArea: {
      paddingRight: wp(15)
    },
    errorWrapper: {
        marginTop: hp(5),
        flexDirection: 'row'
    },
    errorText: {
    //   color: colors.red,
      fontSize: fontSz(10),
      marginTop: hp(1),
      lineHeight: fontSz(16),
      fontFamily: Fonts.Medium,
      alignSelf: 'center',
      // textTransform: 'capitalize'
    },
  });

export { BaseInput };