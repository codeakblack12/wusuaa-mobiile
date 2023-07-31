import React, { FC, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp, wp } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';

interface ResetSuccessfulProps {
    navigation: NavigationProp;
}

const ResetSuccessful: FC<ResetSuccessfulProps>  = ({ navigation }) => {
    return(
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between'}]}>
            <View style={{paddingTop: hp(200)}}>
                <Image
                source={require("../../assets/auth/tick-circle.png")}
                style={{
                    width: wp(85),
                    height: wp(85),
                    alignSelf: 'center'
                }}
                resizeMode='contain'
                />
                <BaseText
                        style={{
                            fontSize: fontSz(20),
                            fontFamily: Fonts.Bold,
                            lineHeight: hp(43.2),
                            marginTop: hp(20),
                            textAlign: 'center'
                        }}
                >
                    Password Reset Successful
                </BaseText>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        marginTop: hp(10),
                        marginBottom: hp(10),
                        textAlign: 'center'
                    }}
                    lineHeight={hp(22)}
                >
                    Your password reset was successful. You'll be automatically logged out, kindly log back in.
                </BaseText>
            </View>
            <BaseButton
                buttonText={"Continue"}
                // loading={true}
                buttonStyle={{
                    marginBottom: hp(20),
                    // position: "absolute",
                    // bottom: hp(40)
                }}
                onPress={() => navigation.navigate("login")}
            />
        </View>
    )
}

export default ResetSuccessful