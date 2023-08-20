import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
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

interface AwaitingPaymentProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const AwaitingPayment: FC<AwaitingPaymentProp> = ({navigation, route}) => {

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
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center'}}>Momo Payment</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }
    return (
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between', paddingBottom: insets.bottom, alignItems: 'center' }]} >
            <Header/>

            <View style={styles.content}>
                <BaseText style={styles.header}>Awaiting payment</BaseText>
                <View style={[ globalStyles.rowBetween, {marginVertical: hp(38), width: '90%'}]}>
                    {/* <View>
                        <SentIcon/>
                    </View> */}
                    <Image
                    style={{width: wp(230), height: hp(6)}}
                    source={require("../../../assets/dockyard/gifs/Loader.gif")}
                    />
                    {/* <View>
                        <ReceivedIcon/>
                    </View> */}
                </View>
                <BaseText style={styles.subheader}>We’re waiting to confirm your transfer{'\n'}This can take a few minutes</BaseText>
            </View>
            <View>
                <BaseButton
                buttonText={"Cancel"}
                onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default AwaitingPayment

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        fontSize: fontSz(20),
        fontFamily: Fonts.Bold
    },
    subheader: {
        fontSize: fontSz(14),
        fontFamily: Fonts.Bold,
        textAlign: 'center'
    }
})