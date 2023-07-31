import React, { FC, useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp, wp } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';

interface ResetProps {
    navigation: NavigationProp;
}

const Reset: FC<ResetProps>  = ({ navigation }) => {
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
                    Create new password below
                </BaseText>
                <BaseInput
                label='New Password'
                password
                secureTextEntry
                />
                <BaseInput
                label='Confirm Password'
                password
                secureTextEntry
                />
            </View>
            <BaseButton
            buttonText={"Continue"}
            // loading={true}
            buttonStyle={{
                // marginTop: hp(40)
            }}
            onPress={() => navigation.navigate("resetPwdSuccess")}
            />
        </View>
    )
}

export default Reset