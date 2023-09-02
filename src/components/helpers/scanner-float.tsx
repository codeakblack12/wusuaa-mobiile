import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { hp, wp } from '../../utils/constants'
import { colors } from '../../utils/colors'
import ScanIcon from "../../assets/dashboard/svg/Scan.svg"
import { useNavigation } from '@react-navigation/native'

const ScannerFloat = () => {
    const navigation = useNavigation()

    return (
        <View style={[styles.btn]}>
            <Pressable onPress={() => navigation.navigate("scanner")} style={styles.btnn}>
                <ScanIcon/>
            </Pressable>
        </View>
    )
}

export default ScannerFloat

const styles = StyleSheet.create({
    btn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        position: "absolute",
        right: wp(16),
        bottom: hp(40),
        shadowColor: "black",
        shadowOpacity: 0.5,
        elevation: 8,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.black
    },
    btnn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
    },
})