import React, { FC, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { HEIGHT, fontSz, hp, layoutAnimation, wp } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../common';


interface TextInputModalProps {
    label: string;
    loading: boolean;
    keyboard?: string;
    disabled: boolean;
    visible: boolean;
    onCancel: any;
    onChange: Function;
    onConfirm: Function;
}

const TextInputModal: FC<TextInputModalProps> = ({
    label,
    loading,
    keyboard = 'default',
    disabled,
    visible,
    onCancel,
    onChange,
    onConfirm,
   }) => {

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
                <BaseInput
                label={label}
                onChangeText={(text: string) => onChange(text)}
                keyboard={keyboard}
                />
                <BaseButton
                buttonText={"Confirm"}
                onPress={onConfirm}
                loading={loading}
                disabled={disabled}
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
        height: hp(253),
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
})

export default TextInputModal;