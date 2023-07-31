import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText, BaseButton } from '../../../components/common';
import { globalStyles } from '../../../utils/globalStyles';
import { hp, wp, fontSz } from '../../../utils/constants';
import { colors } from '../../../utils/colors';
import Fonts from '../../../utils/fonts';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { firstLetterUppercase, formatMoney } from '../../../utils/functions';
import icons from '../../../utils/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Check from '../../../assets/security/icons/check-box.svg'
import Uncheck from '../../../assets/security/icons/uncheck-box.svg'

import { getRequest, sendPost } from '../../../server';
import moment from 'moment';

interface SecurityCartProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const SecurityCart: FC<SecurityCartProp> = ({navigation, route}) => {

    const { _id } = route.params

    const insets = useSafeAreaInsets();

    const [approveditems, setApprovedItems] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCart()
    }, [])

    const getCart = async () => {
        try {
            setLoading(true)
            const response = await getRequest(`sales/cart/${_id}`)
            setData(response.data)
            setLoading(false)
        } catch (error) {
            navigation.goBack()
        }

    }

    const Header = ({}) => {
        return(
            <View style={[globalStyles.rowBetween, {
                width: '100%',
                marginTop: insets.top
            }]}>
                <Pressable onPress={() => navigation.goBack()}>
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
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Security Check</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const SummaryList = ({title, value, total}: any) => {
        return(
            <View style={[globalStyles.rowBetween, {marginTop: total ? 0 : hp(21)}]}>
                <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>{title}</BaseText>
                <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontFamily: Fonts.Bold }}>{value}</BaseText>
            </View>
        )
    }

    const ReceiptHeader = ({}) => {
        return(
            <View>
                <View style={[globalStyles.rowBetween, {
                    marginVertical: hp(34)
                }]}>
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontSize: fontSz(16), fontFamily: Fonts.Bold}}>RECEIPT NO. {_id}</BaseText>
                    <BaseText onPress={onCheckAll} style={{color: colors.primaryTxt, textAlign: 'center', textDecorationLine: 'underline'}}>Check all</BaseText>
                </View>
                <View style={styles.receiptbox}>
                    <View style={styles.receiptbadge}>
                        <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontSize: fontSz(14), fontFamily: Fonts.Bold}}>RECEIPT NO. {_id}</BaseText>
                    </View>
                    <SummaryList
                    title={"Reference number"}
                    value={_id}
                    />
                    <SummaryList
                    title={"Date"}
                    value={data?.createdAt ? moment(data?.createdAt).format("DD MMMM YYYY") : 'N/A'}
                    />
                    <SummaryList
                    title={"Time"}
                    value={data?.createdAt ? moment(data?.createdAt).format("HH:MMaz") : 'N/A'}
                    />
                    <SummaryList
                    title={"Merchant Name"}
                    value={data?.merchant ? `${data?.merchant?.firstName} ${data?.merchant?.lastName}` : 'N/A'}
                    />
                    <View
                    style={{width: '100%', borderWidth: 1, borderColor: colors.border, marginVertical: hp(16), borderStyle: 'dashed'}}
                    />
                    <SummaryList
                    title={"Amount"}
                    value={formatMoney(data?.subtotal, data?.currency)}
                    total
                    />
                </View>
            </View>
        )
    }

    const RenderItem = ({item}: any) => {
        return(
            <Pressable
            onPress={() => approveItems(item.category)}
            style={styles.itemcard}>
                <View>
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
                        {`${item?.quantity} Pack(s) - ${formatMoney(item?.price || 0, item?.currency)}`}
                    </BaseText>
                </View>
                <View>
                    { approveditems.includes(item.category) && <Check/>}
                    { !approveditems.includes(item.category) && <Uncheck/>}
                </View>
            </Pressable>
        )
    }

    const approveItems = async (cat: string) => {
        if(!approveditems.includes(cat)){
            await setApprovedItems((prevItem) => [...prevItem, cat])
        }else{
            await setApprovedItems((prevItem) => [...prevItem.filter((val) => {
                if(val !== cat){
                    return val
                }
            })])
        }
    }

    const onCheckAll = async () => {
        if(!data?.items?.length){
            return
        }
        const all = await data?.items?.map((val) => {
            return val?.category
        })
        setApprovedItems(all)
    }

    const approveCart = async () => {
        try {
            setLoading(true)
            const response = await sendPost('sales/cart/clearance', {
                _id: data?._id
            })
            setLoading(false)
            navigation.navigate("securitycomplete", {receipt_number: _id})

        } catch (error) {
            setLoading(false)
            alert(error?.response?.data?.message)
        }

    }


    return(
        <View style={[globalStyles.wrapper, {paddingHorizontal: wp(15)}]}>
            <Header/>
            <FlatList
            showsVerticalScrollIndicator={false}
            data={data?.items}
            ListHeaderComponent={<ReceiptHeader/>}
            renderItem={({item, index}) => <RenderItem item={item}/>}
            contentContainerStyle={{
                paddingBottom: hp(50)
            }}
            />
            <BaseButton
            buttonText={"Approve"}
            loading={loading}
            disabled={data?.items?.length === approveditems.length ? false : true}
            buttonStyle={{
                marginBottom: insets.bottom,
            }}
            onPress={approveCart}
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
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    receiptbox: {
        width: '100%',
        height: hp(278),
        borderRadius: wp(8),
        backgroundColor: colors.light_gray,
        padding: wp(16)
    },
    receiptbadge: {
        width: '100%',
        height: hp(43),
        borderRadius: hp(4),
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center'
    }
  });

export default SecurityCart