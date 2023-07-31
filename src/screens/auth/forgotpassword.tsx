import React, { FC, useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp } from '../../utils/constants';
import Fonts from '../../utils/fonts';

interface ForgotPasswordProps {
    navigation: NavigationProp;
}

const ForgotPassword: FC<ForgotPasswordProps>  = ({ navigation }) => {
    return(
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between'}]}>
            <View>
                <BaseText
                    style={{
                        fontSize: fontSz(32),
                        fontFamily: Fonts.Bold,
                        lineHeight: hp(43.2),
                        marginTop: hp(20)
                    }}
                >
                    Forgot Password
                </BaseText>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        // lineHeight: hp(18.9),
                        marginTop: hp(10),
                        marginBottom: hp(10)
                    }}
                    lineHeight={hp(22)}
                >
                    Enter Email address
                </BaseText>
                <BaseInput
                label='Email address'
                />
            </View>
            <BaseButton
            buttonText={"Continue"}
            // loading={true}
            buttonStyle={{
                // marginBottom: hp(20),
                // position: "absolute",
                // bottom: hp(40)
            }}
            onPress={() => navigation.navigate("resetPwd")}
            />
        </View>
    )
}

export default ForgotPassword