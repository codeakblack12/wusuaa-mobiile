import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText, BaseButton } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { hp, wp, fontSz, HITSLOP } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '../../../utils/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const Profile: FC<ProfileProp> = ({navigation, route}) => {

    const insets = useSafeAreaInsets();

    const Header = ({}) => {
        return(
            <View style={[globalStyles.rowBetween, {
                width: '100%',
                marginTop: insets.top
            }]}>
                <Pressable hitSlop={HITSLOP} onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.primaryTxt} />
                </Pressable>
                <View
                    style={{
                        height: wp(32), paddingHorizontal: wp(60), borderRadius: hp(8),
                        alignItems: 'center', justifyContent: 'center'
                    }}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontFamily: Fonts.Bold }}>My Profile</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const ButtonRender = ({icon, accent, back, title, onPress}: any) => {
        return(
            <Pressable onPress={onPress} style={[styles.btn, {backgroundColor: back}]}>
                <View style={globalStyles.rowStart}>
                    {icon}
                    <BaseText style={{color: accent, textAlign: 'left', marginLeft: wp(10), fontSize: fontSz(16) }}>{title}</BaseText>
                </View>

                <icons.MaterialIcons name="keyboard-arrow-right" size={24} color={accent} />
            </Pressable>
        )
    }

    const initLogout = async () => {
        Alert.alert(
            'Logout',
            `Are you sure you want to logout`,
            [
                {text: 'No', onPress: () => console.log("")},
                {text: 'Yes', onPress: () => logout()},
            ]
        )
    }

    const logout = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
            navigation.reset({
                index: 0,
                routes: [{ name: 'auth' }],
            })
        } catch (error) {
            console.error('Error clearing app data.');
        }
    }

    return(
        <View style={[globalStyles.wrapper]}>
            <Header/>
            <View style={{marginBottom: hp(20)}} />
            <ButtonRender
            accent={colors.black}
            back={colors.white}
            title={"My Account"}
            icon={<icons.SimpleLineIcons name="user" size={20} color={colors.black} />}
            onPress={() => navigation.navigate("account")}
            />
            <View style={{marginTop: hp(20)}}>
                <ButtonRender
                accent={colors.black}
                back={colors.white}
                title={"Change Password"}
                icon={<icons.SimpleLineIcons name="lock" size={20} color={colors.black} />}
                onPress={() => navigation.navigate("changepassword")}
                />
            </View>
            <View style={{marginVertical: hp(20)}}>
                <ButtonRender
                accent={colors.black}
                back={colors.white}
                title={"Switch Warehouse"}
                icon={<icons.SimpleLineIcons name="organization" size={20} color={colors.black} />}
                onPress={() => navigation.navigate("switchwarehouse")}
                />
            </View>
            <ButtonRender
            accent={colors.white}
            back={colors.black}
            title={"Log out"}
            icon={<icons.SimpleLineIcons name="logout" size={20} color="#fff" />}
            onPress={initLogout}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 0
    },
    subtotal_container: {
        height: hp(44),
        width: '100%',
        backgroundColor: colors.light_gray,
        flexDirection: 'row',
        paddingHorizontal: wp(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(8)
    },
    itemcard: {
        paddingVertical: hp(20),
        borderBottomWidth: hp(1),
        borderColor: colors.border,
        alignItems: 'flex-start'
    },
    btn: {
        width: '100%',
        height: hp(48),
        borderRadius: hp(4),
        backgroundColor: colors.black,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(12)
    }
  });

export default Profile