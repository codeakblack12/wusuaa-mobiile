import React, { FC, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert, InteractionManager, ActivityIndicator } from 'react-native';
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
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { inventoryState } from '../../../redux/slices/inventorySlice';
import { firstLetterUppercase } from '../../../utils/functions';
import RadioSelect from '../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../assets/dockyard/icons/radio-unselect.svg'
import CreateIcon from '../../../assets/dockyard/icons/create.svg'
import Cart from '../../../assets/dockyard/icons/cart.svg'
import { SafeAreaView } from 'react-native-safe-area-context';
import { addToDockyardCart } from '../../../redux/slices/inventorySlice';
import debounce from "lodash.debounce"
import { SocketContext } from '../../../context/socket';
import { initCreateDockCart, salesState } from '../../../redux/slices/salesSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userState } from '../../../redux/slices/userSlice';

interface DockyardProp {
    navigation: NavigationProp;
}

const Dockyard: FC<DockyardProp> = ({navigation}) => {
    const insets = useSafeAreaInsets();

    const dispatch = useAppDispatch()
    const { socket } = useContext(SocketContext)
    const { categories } = useAppSelector(inventoryState)
    const { selected_dock_cart } = useAppSelector(salesState)
    const { active_warehouse } = useAppSelector(userState)

    const modalizeRef = useRef<Modalize>(null);
    const [flashMode, setFlashMode] = useState('off');

    const [selectedCat, setSelectedCat] = useState(null)
    const [isBarcodeRead, setIsBarcodeRead] = useState(false);

    const [tint, setTint] = useState("#fff")

    const [creating, setCreating] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {

        })
    }, [])

    const onError = useCallback(
        (error) => {
          console.log(error)
        },[]
    );

    const onBarCodeRead_ = async (response: any) => {
        console.log("Scanning")
        const content: string = response.data;

        if(!content || !selectedCat?.name || !selected_dock_cart?.uid){
            setTint("red")
            setTimeout(() => {
                setTint("#fff")
            }, 2500)
            return
        }

        console.log({
            item: content,
            cart: selected_dock_cart?.uid,
            category: selectedCat
        })

        setTint("green")
        console.log({
            item: content,
            cart: selected_dock_cart?.uid,
            category: selectedCat?.name,
            warehouse: active_warehouse
        })
        await socket.emit('add_to_dockyard_cart', {
            item: content,
            cart: selected_dock_cart?.uid,
            category: selectedCat?.name,
            // warehouse: active_warehouse
        })
        setTimeout(() => {
            setTint("#fff")
        }, 1500)
    }

    const onBarCodeRead = useCallback(debounce(onBarCodeRead_, 1000, {
        leading: true,
        trailing: false
    }), [selected_dock_cart, selectedCat])

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
                <Pressable
                hitSlop={HITSLOP}
                onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.1)"}}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.white, textAlign: 'center'}}>Dockyard Sales</BaseText>
                </View>
                <TouchableOpacity
                hitSlop={HITSLOP}
                disabled={selected_dock_cart?.uid ? false : true}
                onPress={() => navigation.navigate("dockyardcart", {_id: selected_dock_cart?._id})}
                >
                    <Cart/>
                    {selected_dock_cart?.item_count > 0 && <View style={styles.number}>
                    <BaseText
                    lineHeight={hp(19)}
                        style={{
                            color: colors.black,
                            fontFamily: Fonts.ExtraBold
                        }}
                    >{selected_dock_cart?.item_count}</BaseText>
                    </View>}
                </TouchableOpacity>
            </View>
        )
    }

    const selectCategory = (item) => {
        console.log(item)
        setSelectedCat(item)
    }

    const CategoryRender = ({item, index}: any) => {
        return (
            <TouchableOpacity onPress={() => selectCategory(item)} style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{firstLetterUppercase(item?.name)}</BaseText>
                <View/>
                <View
                >
                    {selectedCat?._id === item?._id ? <RadioSelect/> : <RadioUnselect/>}
                </View>
            </TouchableOpacity>
        )
    }

    const renderCategories = ({item, index}: any) => {
        return(
            <CategoryRender item={item} index={index} />
        )
    }

    const ModalHeader = ({}) => {
        return(
            <View style={{alignItems: 'center'}}>
                <BaseText style={styles.title}>
                    {selectedCat ? `Category: ${firstLetterUppercase(selectedCat.name)}` : `Select a Category to Scan`}
                </BaseText>
                <BaseText style={styles.description}>{selected_dock_cart?.uid}</BaseText>
            </View>
        )
    }

    const CreateHeader = ({}) => {
        return(
            <View style={{alignItems: 'center'}}>
                {!creating && <TouchableOpacity onPress={onCreate} style={{marginTop: hp(30), marginRight: wp(15)}}>
                    <CreateIcon/>
                </TouchableOpacity>}
                {creating && <View style={{marginTop: hp(50)}}><ActivityIndicator size={"small"} /></View>}
            </View>
        )
    }

    const createDockCart = async () => {
        setCreating(true)
        dispatch(initCreateDockCart())
        await socket.emit('create_dockyard_cart', {
            warehouse: active_warehouse
        })
    }

    const onCreate = () => [
        Alert.alert(
            'Dockyard Sale',
            'Do you want to create a new cart',
            [
                {text: 'No', onPress: () => console.log("")},
                {text: 'Yes', onPress: () => createDockCart()},
            ]
        )
    ]

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
                    <Image
                        source={require('../../../assets/general/scan-box.png')}
                        style={[styles.frame, {tintColor: tint}]}
                    />
                    {selected_dock_cart?.uid && <Modalize
                    modalStyle={{backgroundColor: colors.black, flex: 1, paddingHorizontal: wp(16)}}
                    handleStyle={{backgroundColor: colors.primaryBg}}
                    modalHeight={hp(500)}
                    alwaysOpen={hp(117)}
                    handlePosition='inside'
                    HeaderComponent={<ModalHeader/>}
                    ref={modalizeRef}
                    flatListProps={{
                        data: categories,
                        renderItem: renderCategories,
                        initialNumToRender: 10,
                        maxToRenderPerBatch: 10,
                    }}
                    />}
                    {!selected_dock_cart?.uid && <Modalize
                    modalStyle={{backgroundColor: colors.black, flex: 1, paddingHorizontal: wp(16)}}
                    handleStyle={{backgroundColor: colors.primaryBg}}
                    modalHeight={hp(117)}
                    alwaysOpen={hp(117)}
                    handlePosition='inside'
                    withHandle={false}
                    HeaderComponent={<CreateHeader/>}
                    />}
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
    },
    number: {
        minWidth: wp(24),
        height: hp(24),
        borderRadius: hp(12),
        backgroundColor: colors.white,
        position: 'absolute',
        top: -10,
        right: -10,
        alignItems: 'center',
        justifyContent: 'center'
    }
  });

export default Dockyard