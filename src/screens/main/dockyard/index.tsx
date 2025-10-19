import React, { FC, useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert, InteractionManager, ActivityIndicator, ScrollView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseButton, BaseText } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { RNCamera } from 'react-native-camera';
import { hp, wp, fontSz, HITSLOP, linearLayoutAnimation } from '../../../utils/constants';
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
import DockCartAdd from '../../../components/helpers/dock-cart-add';
import AddIcon from "../../../assets/dockyard/icons/add_category.svg"
import { getRequest, sendPost } from '../../../server';

interface DockyardProp {
    navigation: NavigationProp;
}

const Dockyard: FC<DockyardProp> = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const { socket } = useContext(SocketContext)
    const [added, setAdded] = useState([{}])
    const [creating, setCreating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const dispatch = useAppDispatch()
    const { categories } = useAppSelector(inventoryState)
    const { selected_dock_cart } = useAppSelector(salesState)
    const { active_warehouse } = useAppSelector(userState)

    useEffect(() => {
        if(selected_dock_cart?.uid){
            getCartItems()
        }
    }, [selected_dock_cart])


    const getCartItems = async () => {
        try {
            const response = await getRequest(`sales/dockyard-cart-items/${selected_dock_cart?.uid}`)
            if(response?.data?.length){
                setAdded(response?.data)
            }

        } catch (error) {

        }
    }

    const createDockCart = async () => {
        setCreating(true)
        dispatch(initCreateDockCart())
        await socket.emit('create_dockyard_cart', {
            warehouse: active_warehouse
        })
    }

    const closeDockCart = async () => {
        try {
            setDeleting(true)
            const response = await sendPost(`sales/dockyard-cart/close`, {
                cart: selected_dock_cart?.uid
            })
            setDeleting(false)
            navigation.goBack()
        } catch (error) {
            setDeleting(false)
            console.log(error)
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
                <Pressable
                hitSlop={HITSLOP}
                onPress={() => navigation.goBack()}>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.primaryTxt} />
                </Pressable>
                <View
                    style={{height: wp(32), paddingHorizontal: wp(30), borderRadius: hp(8), alignItems: 'center', justifyContent: 'center'}}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Dockyard Sale</BaseText>
                    {selected_dock_cart?.uid && <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontSize: fontSz(10)}}>{selected_dock_cart?.uid}</BaseText>}
                </View>
                <View>
                    <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
                </View>
            </View>
        )
    }

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
            const response = await sendPost('sales/dockyard-cart/add', {
                cart: selected_dock_cart.uid,
                items: added
            })
            setLoading(false)
            navigation.navigate("dockyardcart", {_id: selected_dock_cart?._id})
        } catch (error) {
            setLoading(false)
            alert(error)
        }
    }

    const onCreate = () => {
        // cfc-8WCQMGW
        Alert.alert(
            'Dockyard Sale',
            'Do you want to create a new cart',
            [
                {text: 'No', onPress: () => console.log("")},
                {text: 'Yes', onPress: () => createDockCart()},
            ]
        )
    }

    const onClose = () => {
        Alert.alert(
            'Close Dockyard Sale',
            'Do you want to close this cart',
            [
                {text: 'No', onPress: () => console.log("")},
                {text: 'Yes', onPress: () => closeDockCart()},
            ]
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

    return(
        <View style={[globalStyles.wrapper, {padding: 0, backgroundColor: colors.white}]}>
            <Header/>
            {selected_dock_cart?.uid && <ScrollView style={{flex: 1, paddingHorizontal: wp(15)}}>
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
                    if(added.length < categories.length){
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
                    // marginBottom: hp(100)
                }}
                 onPress={handleConfirm}
                />
                <BaseButton
                buttonText={"Close Cart"}
                loading={deleting}
                disabled={loading || deleting}
                buttonStyle={{
                    marginTop: hp(25),
                    marginBottom: hp(100),
                    backgroundColor: colors.error
                }}
                 onPress={onClose}
                />
            </ScrollView>}
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