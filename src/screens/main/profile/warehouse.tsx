import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import React, { FC, useRef, useState } from 'react'
import icons from '../../../utils/icons'
import { BaseButton, BaseInput, BaseText } from '../../../components/common'
import { colors } from '../../../utils/colors'
import { NavigationProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { globalStyles } from '../../../utils/globalStyles'
import { HITSLOP, fontSz, hp, wp } from '../../../utils/constants'
import Fonts from '../../../utils/fonts'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { changeWarehouse, userState } from '../../../redux/slices/userSlice'
import { Modalize } from 'react-native-modalize'
import { firstLetterUppercase } from '../../../utils/functions'
import RadioSelect from '../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../assets/dockyard/icons/radio-unselect.svg'
import { clearDockCart } from '../../../redux/slices/salesSlice'

interface WarehouseProp {
    navigation: NavigationProp;
    route: NavigationProp;
}
const Warehouse: FC<WarehouseProp> = ({navigation, route}) => {

    const dispatch = useAppDispatch()

    const modalizeRef = useRef<Modalize>(null);

    const insets = useSafeAreaInsets();

    const { active_warehouse, userData } = useAppSelector(userState)

    const [selected, setSelected] = useState(active_warehouse)

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
                        alignItems: 'center', justifyContent: 'center'
                    }}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontFamily: Fonts.Bold }}>Warehouse</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const selectWarehouse = (warehouse: string) => {
        setSelected(warehouse)
    }

    const WarehouseRender = ({item, index}: any) => {
        return (
            <TouchableOpacity onPress={() => selectWarehouse(item)} style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.white
                }}
                >{firstLetterUppercase(item)}</BaseText>
                <View/>
                <View
                >
                    {selected === item ? <RadioSelect/> : <RadioUnselect/>}
                </View>
            </TouchableOpacity>
        )
    }

    const renderWarehouses = ({item, index}: any) => {
        return(
            <WarehouseRender item={item} index={index} />
        )
    }

    const changeWarehouse_ = () => {
        if(selected !== ""){
            dispatch(changeWarehouse(selected))
            dispatch(clearDockCart())
            alert("Successfully updated!")
            navigation.goBack()
        }
    }


    const ModalHeader = ({}) => {
        return(
            <View style={{alignItems: 'center'}}>
                <BaseText style={styles.title}>
                    {`Warehouse`}
                </BaseText>
                <BaseText style={styles.description}>Select warehouse</BaseText>
            </View>
        )
    }

    return (
        <View style={[globalStyles.wrapper]}>
            <Header/>
            <TouchableOpacity activeOpacity={1} onPress={() => modalizeRef.current?.open()}>
                <BaseInput
                value={selected}
                editable={false}
                onPressOut={() => modalizeRef.current?.open()}
                />
            </TouchableOpacity>

            <BaseButton
            buttonText={"Save"}
            buttonStyle={{
                marginTop: hp(40)
            }}
            onPress={() => changeWarehouse_()}
            disabled={active_warehouse === selected ? true : false}
            />

            <Modalize
            modalStyle={{backgroundColor: colors.black, flex: 1, paddingHorizontal: wp(16)}}
            handleStyle={{backgroundColor: colors.primaryBg}}
            modalHeight={hp(500)}
            handlePosition='inside'
            HeaderComponent={<ModalHeader/>}
            ref={modalizeRef}
            flatListProps={{
                data: userData?.warehouse,
                renderItem: renderWarehouses,
                initialNumToRender: 10,
                maxToRenderPerBatch: 10,
            }}
            />
        </View>
    )
}

export default Warehouse

const styles = StyleSheet.create({
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
})