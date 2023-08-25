import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { colors } from '../../../../utils/colors'
import { hp, wp } from '../../../../utils/constants'
import RadioSelect from '../../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../../assets/dockyard/icons/radio-unselect.svg'
import { BaseText } from '../../../../components/common'
import { FlatList } from 'react-native'
import { useAppSelector } from '../../../../redux/hooks'
import { salesState } from '../../../../redux/slices/salesSlice'
import { fontSz } from '../../../../utils/constants'
import Fonts from '../../../../utils/fonts'

export const CartHeader = ({}) => {
    return(
        <View style={{marginBottom: hp(20)}}>
            <BaseText style={styles.title}>Scan  Barcode</BaseText>
            <BaseText style={styles.description}>Select a cart to scan for</BaseText>
        </View>
    )
}

export const CartList = ({selected, onSelect, item}: any) => {
    return(
        <Pressable
        onPress={() => onSelect(item)}
        style={styles.itemCard}>
            <BaseText
            lineHeight={hp(19)}
            style={{
                color: colors.white
            }}
            >{item?.customer_name ? `${item?.customer_name} - ` : ''}{item?.uid}</BaseText>
            <View/>
            <View>
                {selected?._id === item?._id ? <RadioSelect/> : <RadioUnselect/>}
            </View>
        </Pressable>
    )
}

const CartRender = ({selected, onSelect}: any) => {

    const { carts } = useAppSelector(salesState)

    const CartListRender = ({item, index}: any) => {
        return(
            <Pressable
            onPress={() => onSelect(item)}
            style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{item?.uid}</BaseText>
                <View/>
                <View>
                    {selected?._id === item?._id ? <RadioSelect/> : <RadioUnselect/>}
                </View>
            </Pressable>
        )
    }

    return (
        <View>
            <BaseText style={styles.title}>Scan  Barcode</BaseText>
            <BaseText style={styles.description}>Select a cart to scan for</BaseText>
            <FlatList
            data={carts}
            renderItem={({item, index}) => <CartListRender item={item} index={index} />}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={{paddingTop: hp(30)}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    itemCard: {
        paddingVertical: hp(20.5),
        borderBottomWidth: hp(1),
        borderColor: colors.list_border,
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: wp(15)
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
})
export default CartRender