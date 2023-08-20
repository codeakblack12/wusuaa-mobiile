import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useRef, useState} from 'react'
import { useAppSelector } from '../../redux/hooks'
import { inventoryState } from '../../redux/slices/inventorySlice'
import { Modalize } from 'react-native-modalize'
import { colors } from '../../utils/colors'
import { hp, wp } from '../../utils/constants'
import { BaseInput, BaseText } from '../common'
import Fonts from '../../utils/fonts'
import { fontSz } from '../../utils/constants'
import { firstLetterUppercase, formatMoney } from '../../utils/functions'
import RadioSelect from '../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../assets/dockyard/icons/radio-unselect.svg'
import ListSelectModal from '../modals/listModal'
import DropDownIcon from "../../assets/general/icons/arrow-down.svg"
import { globalStyles } from '../../utils/globalStyles'

const DockCartAdd = ({
    data,
    index,
    onChangeCategory,
    onChangeQuantity
}: {data: any, index: number, onChangeCategory: Function, onChangeQuantity: Function}) => {

    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [price, setPrice] = useState(null)
    const [quantity, setQuantity] = useState(data?.quantity || 0)

    const modalizeRef = useRef<Modalize>(null);

    const {
        categories
    } = useAppSelector(inventoryState)

    const onSelectCategory = async (item: any) => {
        try {
            await onChangeCategory(index, {
                category: item?.name,
                quantity: quantity
            })

            setSelected(item)
            setPrice(item?.price[0])
            setVisible(false)

        } catch (error) {
            alert(error)
        }
    }

    const ModalHeader = ({}) => {
        return(
            <View style={{alignItems: 'center'}}>
                <BaseText style={styles.title}>
                    Category
                </BaseText>
                {/* <BaseText style={styles.description}>{selected_dock_cart?.uid}</BaseText> */}
            </View>
        )
    }

    const CategoryRender = ({item, index}: any) => {
        return (
            <TouchableOpacity onPress={() => onSelectCategory(item)} style={styles.itemCard}>
                <BaseText
                lineHeight={hp(19)}
                style={{
                    color: colors.primaryTxt
                }}
                >{firstLetterUppercase(item?.name)}</BaseText>
                <View/>
                <View
                >
                    {selected?._id === item?._id ? <RadioSelect/> : <RadioUnselect/>}
                </View>
            </TouchableOpacity>
        )
    }

    const renderCategories = ({item, index}: any) => {
        return(
            <CategoryRender item={item} index={index} />
        )
    }

    return (
        <View style={styles.container}>
            {index > 0 && <View style={{
                width: '100%',
                borderWidth: hp(1),
                marginTop: hp(30),
                borderColor: colors.gray,
                borderStyle: 'dashed',
            }}/>}
            <TouchableOpacity  activeOpacity={1} onPress={() => setVisible(true)}>
                <BaseInput
                label='Category'
                value={firstLetterUppercase(data?.category)}
                editable={false}
                onPressOut={() => setVisible(true)}
                icon={<DropDownIcon/>}
                />
            </TouchableOpacity>
            <View style={globalStyles.rowBetween}>
                <BaseInput
                label='Unit Price'
                value={formatMoney(price?.value, price?.currency)}
                contStyle={{width: "48%"}}
                editable={false}
                />
                <BaseInput
                label='Quantity'
                value={data?.quantity?.toString()}
                contStyle={{width: "48%"}}
                textInputStyle={{paddingLeft: wp(2)}}
                keyboard='number-pad'
                onChangeText={(text) => {
                    setQuantity(Number(text));
                    onChangeQuantity(index, {
                        ...data,
                        quantity: Number(text)
                    })
                }}
                leftIcon={<BaseText>x</BaseText>}
                />
            </View>
            <BaseInput
            label='Total Price'
            value={formatMoney(price?.value * data?.quantity, price?.currency)}
            editable={false}
            />

            <ListSelectModal
            visible={visible}
            onCancel={() => setVisible(false)}
            data={categories}
            renderItem={renderCategories}
            title='Category'
            />
            {/* <Modalize
            modalStyle={{backgroundColor: colors.black, flex: 1, paddingHorizontal: wp(16)}}
            handleStyle={{backgroundColor: colors.primaryBg}}
            modalHeight={hp(500)}
            handlePosition='inside'
            HeaderComponent={<ModalHeader/>}
            ref={modalizeRef}
            flatListProps={{
                data: categories,
                renderItem: renderCategories,
                initialNumToRender: 10,
                maxToRenderPerBatch: 10,
            }}
            /> */}
        </View>
    )
}

export default DockCartAdd

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
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
        borderColor: colors.border,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
})