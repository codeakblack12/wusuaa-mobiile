import React, { FC, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { RNCamera } from 'react-native-camera';
import { hp, wp, fontSz, linearLayoutAnimation, HITSLOP } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { Modalize } from 'react-native-modalize';
import { BlurView } from "@react-native-community/blur";
import icons from '../../../utils/icons';
import { userState } from '../../../redux/slices/userSlice';
import { salesState, selectCart } from '../../../redux/slices/salesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { SocketContext } from '../../../context/socket';
import CartRender from './components/carts-render';
import CartItemRender from './components/cart-item-render';
import { CartHeader, CartList } from './components/carts-render';
import debounce from "lodash.debounce"
import { CartItemHeader, CartItemList } from './components/cart-item-render';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trigger } from "react-native-haptic-feedback";
import { Notifier, Easing } from 'react-native-notifier';

interface SalesProp {
    navigation: NavigationProp;
}

const Sales: FC<SalesProp> = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch()
    const { userData } = useAppSelector(userState)
    const { carts, sectioned_carts, cart_items } = useAppSelector(salesState)

    // console.log(sectioned_carts)

    const modalizeRef = useRef<Modalize>(null);


    const [flashMode, setFlashMode] = useState('off');

    const [tint, setTint] = useState("#fff")


    const [selectedCart, setSelectedCart] = useState('')

    const [isScanning, setIsScanning] = useState(false)

    const { socket } = useContext(SocketContext);

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
    };

    const onError = useCallback(
        (error: any) => {
          console.log(error)
        },[]
    );

    const onBarCodeRead_ = async (response: any) => {
        console.log("Scanning")
        const content = response.data;
        if(content && selectedCart !== ""){
            console.log(content)
            const already_scanned = await cart_items.map((val: any) => {
                return val?.uid
            })

            if(already_scanned.includes(content)){
                setTint("red")
                 trigger("notificationError", options);
                setTimeout(() => {
                    setTint("#fff")
                }, 2500)
                return
            }

            setTint("green")
            trigger("soft", options);
            await socket.emit('add_to_cart', {
                cart: selectedCart?.uid,
                item: content
            })
            setTimeout(() => {
                setTint("#fff")
            }, 1500)
        }
    }

    // const onBarCodeRead = debounce(onBarCodeRead_, 4000, {
    //     leading: true,
    //     trailing: false
    // })

    const onBarCodeRead = useCallback(debounce(onBarCodeRead_, 1000, {
        leading: true,
        trailing: false
    }), [selectedCart, cart_items])

    const onStatusChange = useCallback(
        (event: any) => {
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
                    <BaseText style={{color: colors.white, textAlign: 'center'}}>Warehouse Sales</BaseText>
                </View>
                <View/>
            </View>
        )
    }

    const renderCart = ({item, index}: any) => {
        return(
            <CartList
            item={item}
            selected={selectedCart}
            onSelect={
                async (item: any) => {  dispatch(selectCart(item)); linearLayoutAnimation(); setSelectedCart(item)}
            } />
        )
    }

    const renderSectionHeader = ({section: {title}}: any) => {
        return(
            <BaseText style={[styles.title, {
            textAlign: 'left', marginLeft: wp(15), fontWeight: 'bold', fontFamily: Fonts.ExtraBold}]}>
                {title}
            </BaseText>
        )
    }

    const renderItem = ({item, index}: any) => {
        return(
            <CartItemList item={item} index={index} />
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
            // flashMode={flashMode}
            onStatusChange={onStatusChange}>
                <View style={[StyleSheet.absoluteFill, styles.imgContainer]}>
                    <Header/>
                    <Image
                        source={require('../../../assets/general/scan-box.png')}
                        style={[styles.frame, {tintColor: tint}]}
                    />
                    <Modalize
                    modalStyle={{backgroundColor: colors.black, flex: 1}}
                    handleStyle={{backgroundColor: colors.primaryBg}}
                    alwaysOpen={hp(117)}
                    handlePosition='inside'
                    HeaderComponent={selectedCart === "" ? <CartHeader/> : <CartItemHeader counter={selectedCart.counter} name={selectedCart?.customer_name} cart={selectedCart.uid}/>}
                    flatListProps={ selectedCart !== "" && {
                        data: cart_items,
                        renderItem: renderItem,
                        initialNumToRender: 10,
                        maxToRenderPerBatch: 10,
                    }}
                    sectionListProps={ selectedCart === "" && {
                        sections: sectioned_carts,
                        renderItem: renderCart,
                        renderSectionHeader: renderSectionHeader,
                        stickySectionHeadersEnabled: false
                    }}
                    ref={modalizeRef}/>
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
      resizeMode: "contain",
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

export default Sales