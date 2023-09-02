import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, ImageBackground } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { RNCamera } from 'react-native-camera';
import { hp, wp, fontSz, HITSLOP } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { Modalize } from 'react-native-modalize';
import { BlurView } from "@react-native-community/blur";
import icons from '../../../utils/icons';
import debounce from "lodash.debounce"
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScannerProp {
    navigation: NavigationProp;
}

const Scanner: FC<ScannerProp> = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const modalizeRef = useRef<Modalize>(null);
    const [flashMode, setFlashMode] = useState('off');
    const [barcode, setBarcode] = useState("")

    const onError = useCallback(
        (error) => {
          console.log(error)
        },[]
        // [onScanError, navigation],
    );

    const onBarCodeRead_ = async (response: any) => {
        console.log("Scanning")
        const content: string = response.data;

        if(!content){
            return
        }

        setBarcode(content)
    }

    const onBarCodeRead = useCallback(debounce(onBarCodeRead_, 1000, {
        leading: true,
        trailing: false
    }), [])

    const onStatusChange = useCallback(
        (event) => {
          console.log(event)
    },[navigation]);

    const Header = ({}) => {
        return(
            <View style={[globalStyles.rowBetween, {
                width: '100%',
                padding: hp(15),
                position: "absolute",
                top: insets.top,
            }]}>
                <Pressable hitSlop={HITSLOP} onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.1)"}}
                >
                    <BaseText style={{color: colors.white, textAlign: 'center'}}>Barcode Scanner</BaseText>
                </View>
                <View/>
            </View>
        )
    }

    return(
        <View style={[globalStyles.wrapper, {padding: 0, backgroundColor: colors.black}]}>
            <RNCamera
            onMountError={onError}
            captureAudio={false}
            style={{flex: 1, width: '100%'}}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={onBarCodeRead}
            flashMode={flashMode}
            onStatusChange={onStatusChange}>
                <View style={[StyleSheet.absoluteFill, styles.imgContainer]}>
                    <Header/>
                    <ImageBackground
                        source={require('../../../assets/general/scan-box.png')}
                        style={styles.frame}
                    >
                        <BaseText style={{color: colors.white, textAlign: 'center', fontSize: fontSz(36), fontFamily: Fonts.Bold}}>{barcode}</BaseText>
                    </ImageBackground>
                    <Modalize
                    modalStyle={{backgroundColor: colors.black, flex: 1}}
                    handleStyle={{backgroundColor: colors.primaryBg}}
                    modalHeight={hp(117)}
                    alwaysOpen={hp(117)}
                    handlePosition='inside'
                    ref={modalizeRef}>
                        <BaseText style={styles.title}>Scan To show code</BaseText>
                        {/* <BaseText style={styles.description}>Select to view receipt</BaseText> */}
                    </Modalize>
                </View>

            </RNCamera>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 0
    },
    frame: {
      width: hp(343),
      height: hp(159),
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: hp(-50),
      opacity: 0.7,
      resizeMode: "contain"
    },
    imgContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomSection: {
        height: hp(143),
        width: '100%',
        backgroundColor: colors.white,
        borderTopLeftRadius: hp(10),
        borderTopRightRadius: hp(10),
        position: 'absolute',
        bottom: 0
    },
    title: {
        fontSize: fontSz(18),
        textAlign: 'center',
        color: colors.primaryBg,
        marginTop: hp(35),
        fontFamily: Fonts.Bold
    },
    description: {
        textAlign: 'center',
        marginTop: hp(10),
        color: colors.primaryBg,
    }
  });

export default Scanner