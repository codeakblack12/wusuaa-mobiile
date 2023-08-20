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
import { UpdateProfileFormData } from '../../../forms/models'
import { UpdateProfileSchema } from '../../../forms/schemas'
import { sendPut } from '../../../server';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getMe, userState } from '../../../redux/slices/userSlice';

interface AccountProp {
    navigation: NavigationProp;
    route: NavigationProp;
}
const Account: FC<AccountProp> = ({navigation, route}) => {

    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()

    const { userData } = useAppSelector(userState)

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
                    <BaseText style={{color: colors.primaryTxt, textAlign: 'center', fontFamily: Fonts.Bold }}>My Account</BaseText>
                </View>
                <icons.AntDesign name="arrowleft" size={hp(20)} color={colors.white} />
            </View>
        )
    }

    const initialValues: UpdateProfileFormData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
        initialValues,
        validationSchema: UpdateProfileSchema,
        onSubmit: async (values: UpdateProfileFormData) => {
            try {
                setLoading(true)
                await sendPut('users/update-me', values)
                await dispatch(getMe())
                alert("Successfully updated!")
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
                Personal Info
            </BaseText>
            <BaseText
                style={{
                    fontFamily: Fonts.Light,
                    lineHeight: hp(18.9),
                    marginTop: hp(10),
                    marginBottom: hp(10)
                }}
            >
                Complete your account setting
            </BaseText>

            <BaseInput
            value={values.firstName}
            label='First Name'
            onChangeText={handleChange('firstName')}
            errorMessage={touched.firstName ? errors.firstName : undefined}
            />

            <BaseInput
            value={values.lastName}
            label='Last Name'
            onChangeText={handleChange('lastName')}
            errorMessage={touched.lastName ? errors.lastName : undefined}
            />

            <BaseInput
            value={values.email}
            label='Email address'
            onChangeText={handleChange('email')}
            errorMessage={touched.email ? errors.email : undefined}
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

export default Account

const styles = StyleSheet.create({})