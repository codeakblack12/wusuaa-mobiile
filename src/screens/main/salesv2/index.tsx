import React, { FC, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
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
import { inventoryState } from '../../../redux/slices/inventorySlice';
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
import DockCartAdd from '../../../components/helpers/dock-cart-add';
import { BaseButton } from '../../../components/common';
import AddIcon from "../../../assets/dockyard/icons/add_category.svg"
import { sendPost } from '../../../server';

interface ManualSalesProp {
    navigation: NavigationProp;
}

const ManualSales: FC<ManualSalesProp> = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch()
    const [added, setAdded] = useState([{}])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const { userData } = useAppSelector(userState)
    const { categories } = useAppSelector(inventoryState)
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

    const onChangeCategory = (indx: number, item: any) => {
        const check = added.filter((val) => {
            if(val?.category === item?.category){
                return val
            }
        })
        if(check.length > 0){
            throw "Category already exists!"
        }
        const new_added = added.map((val, index) => {
            if(index === indx){
                return item
            }else{
                return val
            }
        })
        setAdded(new_added)
    }

    const onChangeQuantity = (indx: number, item: any) => {
        const new_added = added.map((val, index) => {
            if(index === indx){
                return item
            }else{
                return val
            }
        })
        setAdded(new_added)
    }

    const handleConfirm = async () => {
        try {
            setLoading(true)
            const check = added.filter((val) => {
                if(!val?.category || !val?.quantity){
                    return val
                }
            })
            if(check.length > 0){
                throw "Please fill everything appropriately"
            }
            const response = await sendPost('sales/warehouse-cart/add-multiple', {
                cart: selectedCart?.uid,
                items: added
            })
            alert("Added to cart successfully")
            navigation.goBack()
            setLoading(false)

        } catch (error) {
            setLoading(false)
            alert(error)
        }
    }


    const Header = ({}) => {
        return(
            <View style={[globalStyles.rowBetween, {
                width: '100%',
                padding: hp(15),
                // position: "absolute",
                marginTop: insets.top,
                paddingBottom: hp(20),
                borderBottomWidth: hp(1),
                borderColor: colors.border,
            }]}>
                <Pressable hitSlop={HITSLOP} onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.primaryTxt} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center'}}
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Manual Warehouse Sale</BaseText>
                    {selectedCart?.uid && <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontSize: fontSz(10)}}>
                        {selectedCart?.customer_name}-{selectedCart?.uid}
                    </BaseText>}
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
        <View style={[globalStyles.wrapper, {padding: 0, backgroundColor: colors.white}]}>
            <Header/>
            {selectedCart?.uid && <ScrollView style={{flex: 1, paddingHorizontal: wp(15)}}>
                {
                    added.map((val, index) => {
                        return <DockCartAdd
                        data={val}
                        index={index}
                        onChangeCategory={onChangeCategory}
                        onChangeQuantity={onChangeQuantity}
                        />
                    })
                }
                <TouchableOpacity
                style={{marginTop: hp(20), flexDirection: 'row'}}
                onPress={() => {
                    if(added.length < categories?.length){
                        linearLayoutAnimation()
                        setAdded((prev) => [...prev, {}])
                    }else{
                        alert("Category count exceeded!")
                    }
                }}
                >
                    {/* <AddIcon/> */}
                    <BaseText
                    style={{
                        fontSize: fontSz(16),
                        fontFamily: Fonts.Bold
                    }}
                    lineHeight={hp(19)}
                    >
                    + Add Category
                    </BaseText>
                </TouchableOpacity>
                <BaseButton
                buttonText={"Confirm"}
                loading={loading}
                disabled={loading || deleting}
                buttonStyle={{
                    marginTop: hp(50),
                    marginBottom: hp(100)
                }}
                 onPress={handleConfirm}
                />
            </ScrollView>}
            {!selectedCart?.uid && <Modalize
            modalStyle={{backgroundColor: colors.black, flex: 1}}
            handleStyle={{backgroundColor: colors.primaryBg}}
            modalHeight={selectedCart === "" ? hp(700) : hp(117)}
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
            ref={modalizeRef}/>}
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

export default ManualSales