import React, { FC, useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useFormik } from 'formik';
import { NavigationProp } from '@react-navigation/native';
import { BaseText, BaseInput, BaseButton } from '../../components/common';
import { fontSz, hp } from '../../utils/constants';
import Fonts from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { LoginFormData } from '../../forms/models';
import { LoginSchema } from '../../forms/schemas';
import { LoginUser, getMe } from '../../redux/slices/userSlice';
import { useAppDispatch } from '../../redux/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface LoginProps {
    navigation: NavigationProp;
}

const Login: FC<LoginProps>  = ({ navigation }) => {

    const insets = useSafeAreaInsets();

    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)

    const initialValues: LoginFormData = {
        email: '',
        password: '',
        platform: 'MOBILE'
    };

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } = useFormik({
        initialValues,
        validationSchema: LoginSchema,
        onSubmit: (values: LoginFormData) => handleLogin(values),
    });

    const handleLogin = async (data: LoginFormData) => {
        // navigation.navigate("tabs")
        try {
            setLoading(true)
            const login = await dispatch(LoginUser(data))
            if(login?.type === "user/loginUser/fulfilled" && login?.payload?.access_token){
                // navigation.navigate("tabs")
                const userInfo = await dispatch(getMe())
                if(userInfo?.type === "user/me/fulfilled"){
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'dashboard' }],
                    })
                }else{
                    alert("Seems something went wrong!, please try again")
                }

            }else{
                alert("Seems something went wrong!, please try again!")
            }
            setLoading(false)
        } catch (error) {
            alert("Seems something went wrong!")
            setLoading(false)
            console.log(error)
        }
    }

    return(
        <View style={globalStyles.wrapper}>
            <BaseText
                style={{
                    fontSize: fontSz(32),
                    fontFamily: Fonts.Bold,
                    lineHeight: hp(43.2),
                    marginTop: insets.top
                }}
            >
                Login
            </BaseText>
            <BaseText
                style={{
                    fontFamily: Fonts.Light,
                    lineHeight: hp(18.9),
                    marginTop: hp(10),
                    marginBottom: hp(10)
                }}
            >
                Enter your login details below
            </BaseText>
            <BaseInput
            label='Email address'
            onChangeText={handleChange('email')}
            errorMessage={touched.email ? errors.email : undefined}
            />
            <BaseInput
            onChangeText={handleChange('password')}
            label='Password'
            password
            secureTextEntry
            errorMessage={touched.password ? errors.password : undefined}
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end"
            }}>
                <BaseText
                    style={{
                        fontFamily: Fonts.Regular,
                        fontSize: fontSz(12),
                        lineHeight: hp(18.9),
                        marginTop: hp(10),
                        textAlign: "right"
                    }}
                    onPress={() => navigation.navigate("forgotPwd")}
                >
                    Forgot Password?
                </BaseText>
            </View>

            <BaseButton
            buttonText={"Continue"}
            loading={loading}
            buttonStyle={{
                marginTop: hp(40)
            }}
            onPress={handleSubmit}
            />
        </View>
    )
}

export default Login