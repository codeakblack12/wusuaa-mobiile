import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { colors } from '../../../../utils/colors'
import { hp, wp } from '../../../../utils/constants'
import { BaseText } from '../../../../components/common'
import { FlatList } from 'react-native'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks'
import { salesState } from '../../../../redux/slices/salesSlice'
import { fontSz } from '../../../../utils/constants'
import Fonts from '../../../../utils/fonts'
import { SocketContext } from '../../../../context/socket'
import { addItemToCart } from '../../../../redux/slices/salesSlice'
import TickIcon from "../../../../assets/sales/icons/tick-circle.svg"
import { firstLetterUppercase } from '../../../../utils/functions'
import { globalStyles } from '../../../../utils/globalStyles'


export const CartItemHeader = ({counter, cart}: {counter: string, cart: string}) => {
    const dispatch = useAppDispatch()
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.on(cart, (payload: any) => {
            addItem(payload)
        })

        return () => {
            socket.off(cart);
        };

    }, [socket])

    const addItem = async (payload: any) => {
        await dispatch(addItemToCart(payload))
    }

    return(
        <View style={{marginBottom: hp(20)}}>
            <BaseText style={styles.title}>{`Counter ${counter} (${cart})`}</BaseText>
            <BaseText style={styles.description}>All Scanned Items</BaseText>
        </View>
    )
}

export const CartItemList = ({item, index}: any) => {
    return(
        <Pressable
        // onPress={() => onSelect(item)}
        style={styles.itemCard}>
            <View style={globalStyles.rowStart}>
                <BaseText
                lineHeight={hp(19)}
                style={{color: colors.white}}
                >{index + 1}</BaseText>
                <BaseText
                lineHeight={hp(19)}
                style={{color: colors.white, marginHorizontal: wp(32)}}
                >{item?.uid}</BaseText>
                <BaseText
                lineHeight={hp(19)}
                style={{color: colors.white}}
                >{firstLetterUppercase(item?.category)}</BaseText>
            </View>

            <View/>
            <View>
                <TickIcon/>
            </View>
        </Pressable>
    )
}

const CartItemRender = ({
    cart
}: {
    cart: string
}) => {

    const { cart_items } = useAppSelector(salesState)

    const ItemRender = ({item, index}: any) => {
        return(
            <Pressable
            // onPress={() => onSelect(item)}
            style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{item?.uid}</BaseText>
                <View/>
                <View>

                </View>
            </Pressable>
        )
    }

    return (
        <View>
            <BaseText style={styles.title}>{cart}</BaseText>
            <BaseText style={styles.description}>All Scanned Items</BaseText>
            <FlatList
            data={cart_items}
            renderItem={({item, index}) => <ItemRender item={item} index={index} />}
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
export default CartItemRender