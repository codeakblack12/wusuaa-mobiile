import React, { FC, useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { useFormik } from 'formik';
import { ForgotPasswordFormData } from '../../forms/models';
import { ForgotPasswordSchema } from '../../forms/schemas';
import { doPost } from '../../server';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ForgotPasswordProps {
    navigation: NavigationProp;
}

const ForgotPassword: FC<ForgotPasswordProps>  = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false)

    const initialValues: ForgotPasswordFormData = {
        email: '',
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
        initialValues,
        validationSchema: ForgotPasswordSchema,
        onSubmit: async (values: ForgotPasswordFormData) => {
            try {
                setLoading(true)

                const response = await doPost("auth/reset-password", values)
                alert("Check your email for the next steps")
                navigation.goBack()
                setLoading(false)
            } catch (error) {
                alert(error?.response?.data?.message || "Seems something went wrong!")
                setLoading(false)
            }
        },
    });


    return(
        <View style={[globalStyles.wrapper, {justifyContent: 'space-between'}]}>
            <View>
                <BaseText
                    style={{
                        fontSize: fontSz(32),
                        fontFamily: Fonts.Bold,
                        lineHeight: hp(43.2),
                        marginTop: insets.top
                    }}
                >
                    Forgot Password
                </BaseText>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        // lineHeight: hp(18.9),
                        marginTop: hp(10),
                        marginBottom: hp(10)
                    }}
                    lineHeight={hp(22)}
                >
                    Enter Email address
                </BaseText>
                <BaseInput
                label='Email address'
                onChangeText={handleChange('email')}
                errorMessage={touched.email ? errors.email : undefined}
                />
            </View>
            <BaseButton
            buttonText={"Continue"}
            loading={loading}
            buttonStyle={{
                // marginBottom: hp(20),
                // position: "absolute",
                bottom: insets.bottom
            }}
            onPress={handleSubmit}
            />
        </View>
    )
}

export default ForgotPassword