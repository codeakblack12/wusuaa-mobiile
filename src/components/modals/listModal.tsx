import React, { FC, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { HEIGHT, fontSz, hp, layoutAnimation, wp } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../common';
import Fonts from '../../utils/fonts';


interface ListSelectModalProps {
    title: string;
    data: any;
    renderItem: any;
    visible: boolean;
    onCancel: any;
}

const ListSelectModal: FC<ListSelectModalProps> = ({
    title,
    data,
    renderItem,
    visible,
    onCancel,
   }) => {

    const ModalHeader = ({}) => {
        return(
            <View style={{alignItems: 'center'}}>
                <BaseText style={styles.title}>
                    {title}
                </BaseText>
                {/* <BaseText style={styles.description}>{selected_dock_cart?.uid}</BaseText> */}
            </View>
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
        avoidKeyboard
        useNativeDriverForBackdrop>
            <View style={styles.card}>
                <ModalHeader/>
                <FlatList
                data={data}
                renderItem={renderItem}
                />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        width: '100%'
    },
    card: {
        backgroundColor: colors.white,
        height: hp(500),
        width: '100%',
        borderTopRightRadius: wp(8),
        borderTopLeftRadius: wp(8),
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
    title: {
        fontSize: fontSz(18),
        textAlign: 'center',
        color: colors.primaryTxt,
        marginBottom: hp(20),
        // marginTop: hp(35),
        fontFamily: Fonts.Bold
    },
})

export default ListSelectModal;