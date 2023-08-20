import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseButton, BaseText } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { RNCamera } from 'react-native-camera';
import { hp, wp, fontSz, HITSLOP } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { Modalize } from 'react-native-modalize';
import { BlurView } from "@react-native-community/blur";
import icons from '../../../utils/icons';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { inventoryState } from '../../../redux/slices/inventorySlice';
import { firstLetterUppercase } from '../../../utils/functions';
import RadioSelect from '../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../assets/dockyard/icons/radio-unselect.svg'
import Cart from '../../../assets/dockyard/icons/cart.svg'
import { SafeAreaView } from 'react-native-safe-area-context';
import { addToDockyardCart } from '../../../redux/slices/inventorySlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TickCircle from "../../../assets/dockyard/icons/tick-circle.svg"
import { getDockyardCarts } from '../../../redux/slices/salesSlice';

interface SecurityCompleteProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const SecurityComplete: FC<SecurityCompleteProp> = ({navigation, route}) => {

    const { receipt_number } = route.params

    const insets = useSafeAreaInsets();

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getDockyardCarts())
    }, [])

    const { categories, dockyard_cart } = useAppSelector(inventoryState)


    const Header = ({}) => {
        return(
            <SafeAreaView style={[globalStyles.rowBetween, {
                width: '100%',
                padding: hp(15),
                position: "absolute",
                top: hp(0),
            }]}>
                <Pressable hitSlop={HITSLOP} onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.black} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.1)"}}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.white, textAlign: 'center'}}>Cart</BaseText>
                </View>
                <View/>
            </SafeAreaView>
        )
    }

    return(
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between', paddingBottom: insets.bottom, alignItems: 'center' }]}>
            <View/>
            <View style={{alignItems: 'center'}}>
                <TickCircle/>
                <BaseText style={{color: colors.success_green, textAlign: 'center', fontSize: fontSz(20), fontFamily: Fonts.ExtraBold, marginTop: hp(12) }}>
                    Approved
                </BaseText>

                <BaseText style={{textAlign: 'center', fontSize: fontSz(16), fontFamily: Fonts.ExtraBold, marginTop: hp(24) }}>
                    RECEIPT NO. {receipt_number} passes all checks, and has{'\n'}been cleared for checkout
                </BaseText>
            </View>
            <View>
                <BaseButton
                buttonText={"Done"}
                onPress={() => navigation.navigate("dashboard")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 0
    },
  });

export default SecurityComplete