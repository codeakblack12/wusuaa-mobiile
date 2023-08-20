import { StyleSheet, Text, View, Pressable, Image, Linking } from 'react-native'
import React, {FC, useContext, useEffect} from 'react'
import { globalStyles } from '../../../utils/globalStyles'
import icons from '../../../utils/icons'
import { wp, hp, fontSz, HITSLOP } from '../../../utils/constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../utils/colors'
import { BaseText, BaseButton } from '../../../components/common'
import Fonts from '../../../utils/fonts'
import SentIcon from "../../../assets/dockyard/icons/sent_.svg"
import ReceivedIcon from "../../../assets/dockyard/icons/received_.svg"
import RadioSelect from '../../../assets/dockyard/icons/radio-select.svg'
import RadioUnselect from '../../../assets/dockyard/icons/radio-unselect.svg'
import { SocketContext } from '../../../context/socket'
import QRCode from 'react-native-qrcode-svg';


interface ScanToPayProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const ScanToPay: FC<ScanToPayProp> = ({navigation, route}) => {

    const insets = useSafeAreaInsets();

    const { data, cart } = route.params

    const {socket} = useContext(SocketContext)

    useEffect(() => {
        socket.on(`${data?.reference}`, async (payload: any) => {
            if(payload === "SUCCESSFUL"){
                navigation.replace("dockyardcheckout", {data: cart})
            }
            if(payload === "FAILED"){
                alert("Transaction failed")
                navigation.goBack()
            }
        })

        return () => {
            socket.off(`${data?.reference}`);
        };
    }, [])

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
                        alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white,
                        borderWidth: hp(1), borderColor: colors.border
                    }}
                    // reducedTransparencyFallbackColor="white"
                >
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Online Payment</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }


    return (
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between', paddingBottom: insets.bottom, alignItems: 'center' }]}>
            <Header/>

            <View style={styles.content}>
                <QRCode
                value={data?.link}
                // logo={require("../../../assets/dockyard/png/wusuaa.png")}
                // logoSize={100}
                size={wp(222)}
                />
                <BaseText style={styles.header}>Scan to Pay</BaseText>
                <BaseText style={styles.subheader}>We’re waiting to confirm your transfer{'\n'}This can take a few minutes</BaseText>
                <View style={[ globalStyles.rowBetween, {marginTop: hp(15)}]}>
                    <Image
                    style={{width: wp(230), height: hp(6)}}
                    source={require("../../../assets/dockyard/gifs/Loader.gif")}
                    />
                </View>
            </View>
            <View>
                <BaseButton
                buttonText={"Open Link"}
                onPress={() => {Linking.openURL(data?.link)}}
                />
                <BaseText
                onPress={() => navigation.goBack()}
                style={[styles.header, {marginTop: hp(20), textAlign: 'center'}]}>
                    Cancel
                </BaseText>
            </View>

        </View>
    )
}

export default ScanToPay

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        fontSize: fontSz(16),
        fontFamily: Fonts.Bold,
        marginBottom: hp(12),
        marginTop: hp(58)
    },
    subheader: {
        fontSize: fontSz(12),
        fontFamily: Fonts.Bold,
        textAlign: 'center'
    }
})