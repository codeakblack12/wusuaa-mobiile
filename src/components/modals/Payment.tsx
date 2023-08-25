import React, { FC, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { HEIGHT, fontSz, hp, layoutAnimation, wp } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../common';
import { firstLetterUppercase } from '../../utils/functions';
import Fonts from '../../utils/fonts';
import BackArrow from "../../assets/dockyard/icons/arrow-left.svg"
import Trash from "../../assets/dockyard/icons/trash.svg"
import Search from "../../assets/dockyard/icons/Search.svg"

import CloseIcon from "../../assets/general/icons/close-circle.svg"

import Cash from "../../assets/dockyard/icons/cash.svg"
import Wallet from "../../assets/dockyard/icons/wallet.svg"
import Card from "../../assets/dockyard/icons/card.svg"
import Momo from "../../assets/dockyard/icons/momo.svg"

import Select from "../../assets/dockyard/icons/select.svg"
import Unselect from "../../assets/dockyard/icons/unselect.svg"

import { SocketContext } from '../../context/socket';
import { sendPost } from '../../server';

interface PaymentModalProps {
    visible: boolean;
    onCancel: any;
    onPayment: Function;
    data?: any,
    navigation?: any
}

const PaymentModal: FC<PaymentModalProps> = ({
    visible,
    onCancel,
    onPayment,
    data,
    navigation
   }) => {

    const [paytype, setPaytype] = useState("")
    const [loading, setLoading] = useState(false)

    const PayRender = ({icon, title, value}: any) => {
        return(
            <Pressable onPress={() => { console.log(value); setPaytype(value)}} style={[globalStyles.rowBetween, {
                paddingVertical: hp(15), borderBottomWidth: 1, borderColor: colors.border, width: '100%', marginVertical: hp(5)
            }]}>
                <View style={globalStyles.rowStart}>
                    {icon}
                    <BaseText
                    lineHeight={hp(19)}
                    style={{
                        color: colors.black, textAlign: 'left', fontSize: fontSz(16), marginLeft: wp(5)
                    }}>
                        {title}
                    </BaseText>
                </View>
                <View>
                    {value === paytype && <Select/>}
                    {value !== paytype && <Unselect/>}
                </View>
            </Pressable>
        )
    }

    return (
        <Modal
        style={styles.container}
        deviceHeight={HEIGHT}
        onBackdropPress={onCancel}
        isVisible={visible}
        animationIn={'slideInUp'}
        backdropOpacity={0.70}
        animationOutTiming={500}
        swipeDirection={'down'}
        onSwipeComplete={onCancel}
        statusBarTranslucent
        propagateSwipe={true}
        coverScreen
        useNativeDriverForBackdrop>
            <View>
                <View style={styles.card}>
                    <View style={[ globalStyles.rowBetween, styles.head]}>
                        <View style={globalStyles.rowStart}>
                            <BaseText
                            lineHeight={hp(19)}
                            style={{
                                color: colors.black, textAlign: 'left', fontFamily: Fonts.ExtraBold, fontSize: fontSz(16), marginLeft: wp(8)
                            }}>
                                Payment Options
                            </BaseText>
                        </View>
                        <TouchableOpacity onPress={onCancel}>
                            <CloseIcon/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <PayRender
                        icon={<Cash/>}
                        title={"Cash"}
                        key={"cash"}
                        value={"CASH"}
                        />
                        <PayRender
                        icon={<Wallet/>}
                        title={"Online Payment"}
                        key={"online"}
                        value={"ONLINE"}
                        />
                        <PayRender
                        icon={<Card/>}
                        title={"POS (Point of Sale)"}
                        key={"pos"}
                        value={"POS"}
                        />
                        <PayRender
                        icon={<Momo/>}
                        title={"Momo Pay"}
                        key={"momo"}
                        value={"MOMO"}
                        />
                    </View>
                    <View>
                    <BaseButton
                    buttonText={"Confirm"}
                    disabled={paytype === "" ? true : false}
                    onPress={() => {
                        onCancel()
                        onPayment(paytype)
                        // if(paytype === "ONLINE"){
                        //     onCancel()
                        //     onOnline()
                        // }
                        // else if(paytype === "MOMO"){
                        //     onCancel()
                        //     onMomo()
                        // }else{
                        //     onCancel()
                        //     confirmPayment()
                        // }
                    }}
                    loading={loading}
                    />
                    </View>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center'
    },
    container: {
        margin: 0,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: colors.white,
        height: hp(430),
        width: wp(340),
        borderRadius: wp(8),
        bottom: 0,
        alignSelf: 'flex-end',
        paddingHorizontal: wp(16),
        paddingVertical: hp(24),
        justifyContent: 'space-between'
    },
    head: {
        // height: hp(120),
        width: '100%',
        // paddingBottom: hp(24),
        alignItems: 'center'
    },
})

export default PaymentModal;