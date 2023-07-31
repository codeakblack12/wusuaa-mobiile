import React, { FC, useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp, wp } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';
import OtpInputs from 'react-native-otp-inputs';

interface ResetPasswordProps {
    navigation: NavigationProp;
}

const ResetPassword: FC<ResetPasswordProps>  = ({ navigation }) => {
    const otpRef = useRef();
    const [code, setCode] = useState('');
    const handleChange = (code: string) => {
        setCode(code);
    };

    return(
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between'}]}>
            <View style={{flex: 1}}>
                <BaseText
                    style={{
                        fontSize: fontSz(32),
                        fontFamily: Fonts.Bold,
                        lineHeight: hp(43.2),
                        marginTop: hp(20)
                    }}
                >
                    Reset Password
                </BaseText>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        marginTop: hp(10),
                        marginBottom: hp(10)
                    }}
                    lineHeight={hp(22)}
                >
                    Kindly enter the OTP code sent to your registered email address. This code will expire in few seconds
                </BaseText>
                <View style={styles.otpCtn}>
                    <OtpInputs
                        handleChange={(code: string) => handleChange(code)}
                        numberOfInputs={4}
                        keyboardType="phone-pad"
                        clearTextOnFocus
                        selectTextOnFocus={false}
                        ref={otpRef}
                        inputStyles={[styles.otp, {
                            // backgroundColor: isMerchant ? colors.extralightGreen : colors.extralightViolet,
                            // borderColor: isMerchant ? colors.green : colors.violet
                        }]}
                    />
                </View>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        marginTop: hp(20),
                        textAlign: "center",
                        textDecorationLine: "underline"
                    }}
                    lineHeight={hp(22)}
                >
                    Resend Code
                </BaseText>
            </View>
            <BaseButton
                buttonText={"Continue"}
                // loading={true}
                buttonStyle={{
                    // marginBottom: hp(20),
                    // position: "absolute",
                    // bottom: hp(40)
                }}
                onPress={() => navigation.navigate("reset")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    otpCtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: hp(114),
        borderRadius: wp(10),
        // flex: 1,
        alignSelf: 'center',
        marginTop: hp(40),
        backgroundColor: colors.primaryBg,
        shadowColor: colors.gray,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,

        elevation: 3,
    },
    otp: {
        borderBottomWidth: hp(3),
        borderColor: colors.gray,
        height: hp(50),
        width: wp(48),
        textAlign: 'center',
        fontFamily: Fonts.Bold,
        fontSize: fontSz(32),
        marginHorizontal: wp(8),
        color: colors.black
    },
})

export default ResetPassword