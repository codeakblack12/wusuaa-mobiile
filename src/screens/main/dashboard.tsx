import React, { FC, useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BaseText } from '../../components/common';
import { globalStyles } from '../../utils/globalStyles';
import { hp, wp, fontSz } from '../../utils/constants';
import icons from '../../utils/icons';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';
import BoxIcon from "../../assets/dashboard/svg/box.svg";
import PaperIcon from "../../assets/dashboard/svg/paper.svg";
import ShipIcon from "../../assets/dashboard/svg/shipp.svg";
import CartIcon from "../../assets/dashboard/svg/cart.svg";
import { changeWarehouse, userState } from '../../redux/slices/userSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getCategories } from '../../redux/slices/inventorySlice';
import { getCarts, getDockyardCarts, salesState, selectDockCart } from '../../redux/slices/salesSlice';
import { Initials } from '../../utils/functions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocketContext } from '../../context/socket';
import ScannerFloat from '../../components/helpers/scanner-float';


interface DashboardProp {
    navigation: NavigationProp;
}

const Dashboard: FC<DashboardProp> = ({navigation}) => {

    const insets = useSafeAreaInsets();

    const dispatch = useAppDispatch()

    const { getTokenn } = useContext(SocketContext)

    const { userData, active_warehouse } = useAppSelector(userState)
    const { dockyard_carts } = useAppSelector(salesState)

    const isAdmin = userData?.role?.includes("SUPER_ADMIN") || userData?.role.includes("ADMIN") || userData?.role.includes("MANAGER")

    useEffect(() => {
        getActiveWarehouse()
        getTokenn()
        dispatch(getCategories())
    }, [])

    const getActiveWarehouse = async () => {
        if(userData?.warehouse?.length){
            dispatch(changeWarehouse(userData?.warehouse[0]))
        }
    }

    useEffect(() => {
        const didFocusListener = navigation.addListener('focus', async () => {
            dispatch(selectDockCart({}))
            if(isAdmin || userData?.role?.includes("SALES")){
                console.log(active_warehouse)
                await dispatch(getCarts(active_warehouse || userData?.warehouse[0]))
                await dispatch(getDockyardCarts(active_warehouse || userData?.warehouse[0]))
            }
        });

        return () => didFocusListener();
    }, [navigation, active_warehouse]);

    const data = [
        {
            id: 1,
            title: "Inventory Management",
            icon: <BoxIcon/>,
            onPress: () => navigation.navigate("inventory"),
            disabled: !isAdmin && !userData?.role.includes("INVENTORY_MANGEMENT")
        },
        {
            id: 2,
            title: "Dockyard Sales",
            icon: <ShipIcon/>,
            onPress: () => navigation.navigate("dockyard"),
            disabled: !isAdmin && !userData?.role.includes("SALES")
        },
        {
            id: 3,
            title: "Warehouse Sales",
            icon: <CartIcon/>,
            onPress: () => navigation.navigate("sales"),
            disabled: !isAdmin && !userData?.role.includes("SALES")
        },
        {
            id: 4,
            title: "Warehouse Manual Sales",
            icon: <CartIcon/>,
            onPress: () => navigation.navigate("manualsales"),
            disabled: !isAdmin && !userData?.role.includes("SALES")
        },
        {
            id: 5,
            title: "Security Checks",
            icon: <PaperIcon/>,
            onPress: () => navigation.navigate("security"),
            disabled: !isAdmin && !userData?.role.includes("SECURITY")
        },
    ]

    const Card = ({item}: any) => {
        return(
            <Pressable disabled={item.disabled} onPress={item?.onPress} style={styles.card}>
                <View>
                {item?.icon}
                </View>

                <BaseText
                    style={{
                        fontSize: fontSz(12),
                        fontFamily: Fonts.Regular,
                        marginTop: hp(10),

                    }}
                    lineHeight={hp(16)}
                >
                    {item?.title}
                </BaseText>
                {item.disabled && <View style={{position: "absolute", top: hp(10), right: hp(10)}}>
                    <icons.FontAwesome name="lock" size={hp(18)} color={colors.gray} />
                </View>}
            </Pressable>
        )
    }

    const Tiles = ({}) => {
        return(
            <View style={{marginTop: hp(15)}}>
                 <BaseText
                    style={{
                        fontSize: fontSz(16),
                        fontFamily: Fonts.Bold,
                    }}
                    lineHeight={hp(22)}
                >
                    What would you like to scan for?
                </BaseText>
                <View style={styles.cardCtn} >
                    {
                        data.map((val) => {
                            return <Card key={val.id} item={val} />
                        })
                    }
                </View>
                {dockyard_carts.length > 0 && <View>
                    <BaseText
                        style={{
                            fontSize: fontSz(14),
                            fontFamily: Fonts.Regular,
                            color: colors.mildTxt,
                            marginTop: hp(16),
                            marginBottom: hp(4)
                        }}
                        lineHeight={hp(19)}
                    >
                        Recent dockyard Sales
                    </BaseText>
                </View>}
            </View>
        )
    }

    const DockRender = ({item}) => {
        return(
            <Pressable
            onPress={async () => {
                dispatch(selectDockCart(item));
                navigation.navigate("dockyard")
            }}
            style={styles.dockcard}>
                <View>
                    <BaseText
                        style={{
                            fontSize: fontSz(14),
                            fontFamily: Fonts.Regular,
                            marginBottom: hp(8)
                        }}
                        lineHeight={hp(19)}
                    >
                        {item?.uid}
                    </BaseText>
                    <BaseText
                        style={{
                            fontSize: fontSz(12),
                            fontFamily: Fonts.Regular,
                            color: colors.mildTxt,
                        }}
                        lineHeight={hp(16)}
                    >
                        {`${item?.item_count || 0} item(s) added`}
                    </BaseText>

                </View>

                <View>
                    <BaseText
                        style={{
                            fontSize: fontSz(12),
                            fontFamily: Fonts.Medium,
                            color: colors.mildTxt,
                        }}
                        lineHeight={hp(16)}
                    >
                        {new Date(item.createdAt).toDateString()}
                    </BaseText>
                </View>
            </Pressable>
        )
    }


    return(
        <View style={[globalStyles.wrapper, {paddingHorizontal: 0}]}>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <View>
                    <BaseText
                        style={{
                            fontSize: fontSz(12),
                            fontFamily: Fonts.Regular,
                            color: colors.gray
                        }}
                        lineHeight={hp(16)}
                    >
                        Good morning,
                    </BaseText>
                    <BaseText
                        style={{
                            fontSize: fontSz(14),
                            fontFamily: Fonts.Regular,
                            color: colors.real_black
                        }}
                        lineHeight={hp(19)}
                    >
                        {`Welcome ${userData.firstName}`}
                    </BaseText>
                    <BaseText
                        style={{
                            fontSize: fontSz(12),
                            fontFamily: Fonts.Regular,
                            color: colors.gray
                        }}
                    >
                        {`Current Warehouse: ${active_warehouse}`}
                    </BaseText>
                </View>
                <Pressable onPress={() => navigation.navigate("profile")} style={{
                    borderRadius: hp(100), backgroundColor: colors.black, width: wp(30), height: wp(30),
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <BaseText
                        style={{
                            fontSize: fontSz(16),
                            fontFamily: Fonts.Bold,
                            color: colors.white
                        }}
                        lineHeight={hp(19)}
                    >
                        {Initials(`${userData.firstName} ${userData.lastName}`)}
                    </BaseText>
                </Pressable>
            </View>
            <View style={[globalStyles.wrapper, {paddingTop: 0}]}>
                <FlatList
                data={dockyard_carts}
                renderItem={({item, index}) => <DockRender item={item}/>}
                ListHeaderComponent={<Tiles/>}
                keyExtractor={(item) => item._id}
                />
            </View>
            <ScannerFloat/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: hp(15),
        paddingBottom: hp(20),
        borderBottomWidth: hp(1),
        borderColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    card: {
        width: wp(161),
        height: hp(133),
        borderRadius: hp(8),
        backgroundColor: colors.white,
        marginTop: hp(20),
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: 'rgba(16, 32, 52, 0.5)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    cardCtn: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: wp(2),
        marginTop: hp(20),
        paddingBottom: hp(32),
        borderBottomWidth: 1,
        borderColor: colors.border
    },
    dockcard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
        borderBottomWidth: 1,
        borderColor: colors.border
    }
})

export default Dashboard