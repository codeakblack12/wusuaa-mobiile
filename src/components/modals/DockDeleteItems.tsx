import React, { FC, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { HEIGHT, fontSz, hp, layoutAnimation, wp } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput } from '../common';
import { firstLetterUppercase } from '../../utils/functions';
import Fonts from '../../utils/fonts';
import BackArrow from "../../assets/dockyard/icons/arrow-left.svg"
import Trash from "../../assets/dockyard/icons/trash.svg"
import Search from "../../assets/dockyard/icons/Search.svg"

import { SocketContext } from '../../context/socket';

interface DockDeleteItemModalProps {
    visible: boolean;
    onCancel: any;
    data?: any,
    cart?: string
}

const DockDeleteItemModal: FC<DockDeleteItemModalProps> = ({
    visible,
    onCancel,
    data,
    cart
   }) => {
    const { socket } = useContext(SocketContext)
    const [filter, setFilter] = useState([])
    const [deleted, setDeleted] = useState([])

    useEffect(() => {
        setFilter(data?.items)
    }, [data])
    // console.log(data)

    const ItemRender = ({item}: any) => {
        return(
            <View style={[globalStyles.rowBetween, {
                paddingVertical: hp(15), borderBottomWidth: 1, borderColor: colors.border, width: '100%'
            }]}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.black, textAlign: 'left', fontSize: fontSz(12)
                }}>
                    {item.uid}
                </BaseText>
                <TouchableOpacity onPress={() => onDelete(item?.uid)} style={{marginRight: wp(10)}}>
                    <Trash/>
                </TouchableOpacity>

            </View>
        )
    }

    const onSearch = async (text: string) => {
        const search = await data?.items?.filter((val: any) => {
            if(val.uid.toLowerCase().includes(text.toLowerCase()) && !deleted.includes(val.uid)){
                return val
            }
        })

        setFilter(search)
    }

    const onClearAll = async () => {
        await socket.emit('delete_from_dockyard_cart', {
            cart: cart,
            item: "all",
            category: data.category
        })
        setTimeout(() => {
            onCancel()
        }, 1500)
    }

    const initClear = () => {
        Alert.alert(
            'Clear',
            `Are you sure you want to clear all ${data.category}`,
            [
                {text: 'No', onPress: () => console.log("")},
                {text: 'Yes', onPress: () => onClearAll()},
            ]
        )
    }

    const onDelete = async (item: string) => {
        const filter_ = filter.filter((val: any) => {
            if(val.uid !== item){
                return val
            }
        })

        await socket.emit('delete_from_dockyard_cart', {
            cart: cart,
            item: item,
            category: data.category
        })

        layoutAnimation()
        setDeleted((prevState) => [...prevState, item])
        setFilter(filter_)
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
                            <BackArrow/>
                            <BaseText
                            lineHeight={hp(19)}
                            style={{
                                color: colors.black, textAlign: 'left', fontFamily: Fonts.ExtraBold, fontSize: fontSz(14), marginLeft: wp(8)
                            }}>
                                {firstLetterUppercase(data?.category)}
                            </BaseText>
                        </View>
                        <TouchableOpacity onPress={initClear}>
                            <BaseText
                            lineHeight={hp(19)}
                            style={{
                                textAlign: 'left', fontFamily: Fonts.ExtraBold, fontSize: fontSz(12)
                            }}>
                                Clear all
                            </BaseText>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                    data={filter}
                    renderItem={({item, index}) => <ItemRender item={item} />}
                    stickyHeaderIndices={[0]}
                    ListHeaderComponent={
                        <BaseInput
                        placeholder='Search...'
                        onChangeText={onSearch}
                        textInputStyle={{
                            height: hp(20), backgroundColor: colors.white
                        }}
                        containerStyle={{
                            height: hp(45), backgroundColor: colors.white, minHeight: hp(45)
                        }}
                        contStyle={{marginTop: 0, marginBottom: hp(10)}}
                        icon={<View style={{marginRight: wp(10)}}><Search/></View>}
                        />
                    }
                    />
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
        minHeight: hp(685),
        maxHeight: hp(685),
        width: wp(340),
        borderRadius: wp(8),
        bottom: 0,
        alignSelf: 'flex-end',
        paddingHorizontal: wp(16)
    },
    head: {
        // height: hp(120),
        width: '100%',
        paddingVertical: hp(24),
        alignItems: 'center'
    },
})

export default DockDeleteItemModal;