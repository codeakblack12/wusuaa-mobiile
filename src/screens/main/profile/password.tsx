import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { FC, useState } from 'react'
import { useFormik } from 'formik';
import icons from '../../../utils/icons'
import { BaseButton, BaseInput, BaseText } from '../../../components/common'
import { colors } from '../../../utils/colors'
import { NavigationProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { globalStyles } from '../../../utils/globalStyles'
import { HITSLOP, fontSz, hp, wp } from '../../../utils/constants'
import Fonts from '../../../utils/fonts'
import { ChangePasswordFormData } from '../../../forms/models';
import { ChangePasswordSchema } from '../../../forms/schemas';
import { sendPut } from '../../../server';

interface ChangePasswordProp {
    navigation: NavigationProp;
    route: NavigationProp;
}

const ChangePassword: FC<ChangePasswordProp> = ({navigation, route}) => {

    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false)

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
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontFamily: Fonts.Bold }}>Change Password</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const initialValues: ChangePasswordFormData = {
        oldPassword: '',
        newPassword: '',
        cNewPassword: ''
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
        initialValues,
        validationSchema: ChangePasswordSchema,
        onSubmit: async (values: ChangePasswordFormData) => {
            try {
                setLoading(true)
                await sendPut('users/change-password', values)
                alert("Password changed successfully!")
                setLoading(false)
            } catch (error) {
                setLoading(false)
                alert(error?.response?.data?.message)
            }
        },
    });

    return (
        <View style={[globalStyles.wrapper]}>
            <Header/>
            <BaseText
                style={{
                    fontSize: fontSz(32),
                    fontFamily: Fonts.Bold,
                    lineHeight: hp(43.2),
                    marginTop: insets.top/2
                }}
            >
                Change Password
            </BaseText>
            <BaseText
                style={{
                    fontFamily: Fonts.Light,
                    lineHeight: hp(18.9),
                    marginTop: hp(10),
                    marginBottom: hp(10)
                }}
            >
                Complete your security update
            </BaseText>

            <BaseInput
            value={values.oldPassword}
            onChangeText={handleChange('oldPassword')}
            label='Current Password'
            password
            secureTextEntry
            errorMessage={touched.oldPassword ? errors.oldPassword : undefined}
            />

            <BaseInput
            value={values.newPassword}
            onChangeText={handleChange('newPassword')}
            label='New Password'
            password
            secureTextEntry
            errorMessage={touched.newPassword ? errors.newPassword : undefined}
            />

            <BaseInput
            value={values.cNewPassword}
            onChangeText={handleChange('cNewPassword')}
            label='Confirm New Password'
            password
            secureTextEntry
            errorMessage={touched.cNewPassword ? errors.cNewPassword : undefined}
            />


            <BaseButton
            buttonText={"Save"}
            loading={loading}
            buttonStyle={{
                marginTop: hp(40)
            }}
            onPress={handleSubmit}
            />
        </View>
    )
}

export default ChangePassword

const styles = StyleSheet.create({})