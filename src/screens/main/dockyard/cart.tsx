import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText, BaseButton } from '../../../components/common';
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
import { firstLetterUppercase, formatMoney } from '../../../utils/functions';
import RadioSelect from '../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../assets/dockyard/icons/radio-unselect.svg'
import Cart from '../../../assets/dockyard/icons/cart.svg'
// import { SafeAreaView } from 'react-native-safe-area-context';
import { addToDockyardCart } from '../../../redux/slices/inventorySlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRequest, sendPost } from '../../../server';
import { salesState } from '../../../redux/slices/salesSlice';
import DockDeleteItemModal from '../../../components/modals/DockDeleteItems';
import PaymentModal from '../../../components/modals/Payment';
import TextInputModal from '../../../components/modals/InputModal';

interface DockyardCartProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const DockyardCart: FC<DockyardCartProp> = ({navigation, route}) => {
    const { _id } = route.params

    const dispatch = useAppDispatch()

    const insets = useSafeAreaInsets();

    const [data, setData] = useState(null)
    const [identifier, setIdentifier] = useState("")
    const [paytype, setPaytype] = useState("")
    const [loading, setLoading] = useState(true)

    const [modal, setModal] = useState(false)
    const [tmodal, setTModal] = useState(false)
    const [pay, setPay] = useState(false)
    const [selitem, setSelItem] = useState(null)

    const { categories, dockyard_cart } = useAppSelector(inventoryState)
    const { selected_dock_cart } = useAppSelector(salesState)

    useEffect(() => {
        getCart()
    }, [])


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
                        alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
                        borderWidth: hp(1), borderColor: colors.border
                    }}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Cart</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const RenderItem = ({item}: any) => {
        return(
            <Pressable
            disabled={loading}
            onPress={async () => {
                await setSelItem(item)
                setModal(true)
                // setTimeout(() => {
                //     setModal(true)
                // }, 500)
            }}
            style={styles.itemcard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.primaryTxt, textAlign: 'left', fontFamily: Fonts.Bold,
                }}>
                    {firstLetterUppercase(item.category)}
                </BaseText>
                <BaseText
                lineHeight={hp(16)}
                style={{
                    color: colors.primaryTxt, textAlign: 'left', fontFamily: Fonts.Light, fontSize: fontSz(12),
                    marginTop: hp(4)
                }}>
                    {`${item?.quantity} Pack(s) - ${formatMoney(item?.price || 0, data?.currency)}`}
                </BaseText>
            </Pressable>
        )
    }

    const getCart = async () => {
        try {
            setLoading(true)
            const response = await getRequest(`sales/dockyard-cart/${_id}`)
            setData(response.data)
            setLoading(false)
        } catch (error) {
            navigation.goBack()
        }

    }

    const onlinePayment = async () => {
        // setTModal(false)
        // setTimeout(() => {
        //     navigation.navigate("scantopay", {data: {reference: "1234567", link: "https://checkout.paystack.com/0mrdi6p7o60jx7x"}, cart: data})
        // }, 500)
        // return
        try {
            setLoading(true)
            const response = await sendPost('sales/payment/paystack-link', {
                id: data?._id,
                email: identifier,
                location: "DOCKYARD"
            })
            console.log(response.data)
            setTModal(false)
            setTimeout(() => {
                navigation.navigate("scantopay", {data: response.data, cart: data})
            }, 500)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert(error?.response?.data?.message)
        }
    }

    const momoPayment = async () => {
        // navigation.navigate("awaitingpayment", {data: {reference: "1234565"}})
        // return
        try {
            setLoading(true)
            const response = await sendPost('sales/payment/momo-pay', {
                id: data?._id,
                phone_number: identifier,
                location: "DOCKYARD"
            })
            console.log(response.data)
            setTModal(false)
            setTimeout(() => {
                navigation.navigate("awaitingpayment", {data: response.data, cart: data})
            }, 500)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert(error?.response?.data?.message)
        }
    }

    const confirmPayment = async () => {
        try {
            setLoading(true)
            const response = await sendPost('sales/dockyard-cart/checkout', {
                id: data._id,
                payment_type: paytype,
                email: identifier
            })
            setLoading(false)
            setTModal(false)
            setTimeout(() => {
                navigation.navigate("dockyardcheckout", {data: data})
            }, 500)

        } catch (error) {
            setLoading(false)
            alert(error?.response?.data?.message)
        }
    }

    const onPayment = (value: string) => {
        setPaytype(value)
        setTimeout(() => {
            setTModal(true)
        }, 1000)
    }

    const SummaryData = [
        {
            id: 1,
            title: "Subtotal",
            value: formatMoney(data?.subtotal || 0, data?.currency)
        },
        {
            id: 2,
            title: `NHIL/GETFD/COVID (${Math.round(data?.covidVatValue * 10) / 10 || "0"}%)`,
            value: formatMoney(data?.covidVat || 0, data?.currency)
        },
        {
            id: 3,
            title: `VAT(${Math.round(data?.vatValue * 10) / 10 || "0"}%)`,
            value: formatMoney(data?.vat || 0, data?.currency)
        },
        {
            id: 4,
            title: `Total`,
            value: formatMoney(data?.total || 0, data?.currency)
        },
    ]

    const Summary = ({}) => {
        return(
            <View>
                <BaseText
                lineHeight={hp(27)}
                style={{
                    color: colors.primaryTxt, textAlign: 'left', fontFamily: Fonts.Bold, fontSize: fontSz(20),
                    marginTop: hp(24)
                }}>
                    Checkout Summary
                </BaseText>
                {SummaryData?.map((val) => {
                    return <View style={styles.subtotal_container}>
                    <BaseText
                    lineHeight={hp(22)}
                    style={{
                        color: colors.black, textAlign: 'left', fontFamily: Fonts.Bold, fontSize: fontSz(16)
                    }}>
                        {val?.title}
                    </BaseText>
                    <BaseText
                    lineHeight={hp(22)}
                    style={{
                        color: colors.black, textAlign: 'left', fontFamily: Fonts.Bold, fontSize: fontSz(16)
                    }}>
                        {val?.value}
                    </BaseText>
                </View>
                })}
            </View>
        )
    }

    return(
        <View style={[globalStyles.wrapper, {paddingHorizontal: wp(15)}]}>
            <Header/>

            <FlatList
            data={data?.items}
            renderItem={({item}) => <RenderItem item={item} />}
            ListHeaderComponent={<Summary/>}
            contentContainerStyle={{
                paddingBottom: hp(150), paddingTop: hp(10)
            }}
            />

            <BaseButton
            buttonText={"Checkout"}
            loading={loading}
            disabled={loading || !data?.subtotal}
            buttonStyle={{
                marginBottom: insets.bottom,
            }}
            onPress={() => setPay(true)}
            />

            <DockDeleteItemModal
            visible={modal}
            onCancel={() => {
                setModal(false);
                setTimeout(() => {
                    getCart()
                }, 1000)
            }}
            data={selitem}
            cart={data?.uid}
            />
            <PaymentModal
            visible={pay}
            onCancel={() => {
                setPay(false)
            }}
            navigation={navigation}
            data={data}
            onPayment={onPayment}
            />
            <TextInputModal
            label={`Enter ${paytype === "MOMO" ? "Phone Number" : "Email Address"}${(paytype === "CASH" || paytype === "POS") ? " (Optional)" : ""}`}
            visible={tmodal}
            onCancel={() => {
                setTModal(false)
            }}
            loading={loading}
            keyboard={paytype === "MOMO" ? 'phone-pad' : 'email-address'}
            disabled={(paytype === "CASH" || paytype === "POS") ? false : (identifier === "" ? true : false)}
            onChange={(text: string) => setIdentifier(text)}
            onConfirm={() => {
                if(paytype === "MOMO"){
                    momoPayment()
                    return
                }
                else if(paytype === "CASH" || paytype === "POS"){
                    confirmPayment()
                    return
                }
                else if(paytype === "ONLINE"){
                    onlinePayment()
                    return
                }else{
                    return
                }
            }}
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
    }
  });

export default DockyardCart