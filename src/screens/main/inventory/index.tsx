import React, { FC, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { RNCamera } from 'react-native-camera';
import { hp, wp, fontSz } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { Modalize } from 'react-native-modalize';
import { BlurView } from "@react-native-community/blur";
import icons from '../../../utils/icons';
import debounce from "lodash.debounce"
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { inventoryState } from '../../../redux/slices/inventorySlice';
import { addItem } from '../../../redux/slices/inventorySlice';
import { firstLetterUppercase } from '../../../utils/functions';
import { SocketContext } from '../../../context/socket';
import { userState } from '../../../redux/slices/userSlice';
import { trigger } from "react-native-haptic-feedback";
import { Notifier, Easing } from 'react-native-notifier';

interface InventoryProp {
    navigation: NavigationProp;
}

const Inventory: FC<InventoryProp> = ({navigation}) => {
    const { userData, active_warehouse } = useAppSelector(userState)
    const dispatch = useAppDispatch()
    const { socket } = useContext(SocketContext)

    const { scanned_inventory, categories } = useAppSelector(inventoryState)
    const modalizeRef = useRef<Modalize>(null);
    const [flashMode, setFlashMode] = useState('off');
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);

    const [tint, setTint] = useState("#fff")

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
    };

    useEffect(() => {
        socket.on(`INVENTORY-${active_warehouse}`, async (payload: any) => {
            trigger("notificationSuccess", options);
            Notifier.showNotification({
                title: `${payload?.uid?.toUpperCase()}`,
                description: 'Item Added to Inventory',
                duration: 0,
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                hideOnPress: false,
            });
            await dispatch(addItem(payload))
        })

        return () => {
            socket.off(`INVENTORY-${active_warehouse}`);
        };
    }, [])

    const onError = useCallback(
        (error) => {
          console.log(error)
        },[]
    );

    const onBarCodeRead_ = async (response: any) => {
        console.log("Scanning")
        const content: string = response.data;

        if(!content){
            setTint("red")
            trigger("notificationError", options);
            setTimeout(() => {
                setTint("#fff")
            }, 2500)
            return
        }
        const check = await scanned_inventory.filter((val) => {
            if(val?.uid === content){
                return val
            }
        })
        console.log(check)
        if(check.length > 0){
            // Alert.alert(
            //     'Error',
            //     'Item already scanned',
            //     [
            //         {text: 'Ok', onPress: () => setIsBarcodeRead(false)},
            //     ]
            // );
            setTint("red")
            trigger("notificationError", options);
            setTimeout(() => {
                setTint("#fff")
            }, 2500)
            return
        }
        // const resp = await dispatch(addItem(content))
        setTint("green")
        trigger("soft", options);
        await socket.emit('add_to_inventory', {
            id: content,
            warehouse: active_warehouse
        })
        setTimeout(() => {
            setTint("#fff")
        }, 1500)
    }

    const onBarCodeRead = useCallback(debounce(onBarCodeRead_, 1000, {
        leading: true,
        trailing: false
    }), [scanned_inventory])

    const onStatusChange = useCallback(
        (event) => {
          console.log(event)
    },[navigation]);

    const Header = ({}) => {
        return(
            <SafeAreaView style={[globalStyles.rowBetween, {
                width: '100%',
                padding: hp(15),
                position: "absolute",
                top: hp(0),
            }]}>
                <Pressable onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.1)"}}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.white, textAlign: 'center'}}>Inventory Management</BaseText>
                </View>
                <View/>
            </SafeAreaView>
        )
    }

    const ItemRender = ({item, index}: any) => {
        return (
            <View style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{index + 1}</BaseText>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{firstLetterUppercase(item?.category)}</BaseText>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white,
                    fontFamily: Fonts.Bold
                }}
                >{item?.uid?.toUpperCase()}</BaseText>
            </View>
        )
    }

    const ModalHeader = ({}) => {
        return(
            <Pressable
            // onPress={() => modalizeRef?.current?.open()}
            style={{alignItems: 'center'}}>
                <BaseText style={styles.title}>Scan  Barcode</BaseText>
                <BaseText style={styles.description}>View scanned items</BaseText>
            </Pressable>
        )
    }

    const renderInventory = ({item, index}: any) => {
        return(
            <ItemRender item={item} index={index} />
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
            onStatusChange={onStatusChange}
            >
                <View style={[StyleSheet.absoluteFill, styles.imgContainer]}>
                    <Header/>
                    <Image
                        source={require('../../../assets/general/scan-box.png')}
                        style={[styles.frame, {tintColor: tint}]}
                    />
                    <Modalize
                    modalStyle={{backgroundColor: colors.black, flex: 1, paddingHorizontal: wp(16)}}
                    handleStyle={{backgroundColor: colors.primaryBg}}
                    alwaysOpen={hp(117)}
                    handlePosition='inside'
                    ref={modalizeRef}
                    HeaderComponent={<ModalHeader/>}
                    flatListProps={{
                        data: scanned_inventory,
                        renderItem: renderInventory,
                        initialNumToRender: 10,
                        maxToRenderPerBatch: 10,
                    }}
                    />
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
      width: hp(225),
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
        marginBottom: hp(20)
    },
    itemCard: {
        paddingVertical: hp(20.5),
        borderBottomWidth: hp(1),
        borderColor: colors.list_border,
        flexDirection: "row",
        justifyContent: 'space-between'
    }
  });

export default Inventory