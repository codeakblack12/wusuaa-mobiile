import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/login';
import ForgotPassword from '../screens/auth/forgotpassword';
import ResetPassword from '../screens/auth/resetpassword';
import ResetSuccessful from '../screens/auth/resetsuccessful';
import Reset from '../screens/auth/reset';
import { BottomSheetTransition, HorizontalTransition } from '../utils/constants';

const Stack = createStackNavigator();

export const AuthStack = () => {

    return(
        <Stack.Navigator
            initialRouteName={"login"}
            screenOptions={{
                headerShown: false,
                // gestureEnabled: true,
                // gestureDirection: 'vertical'
            }}>
            <Stack.Screen name='login' component={Login} options={BottomSheetTransition} />
            <Stack.Screen name='forgotPwd' component={ForgotPassword} options={HorizontalTransition} />
            <Stack.Screen name='resetPwd' component={ResetPassword} options={HorizontalTransition} />
            <Stack.Screen name='reset' component={Reset} options={HorizontalTransition} />
            <Stack.Screen name='resetPwdSuccess' component={ResetSuccessful} options={HorizontalTransition} />
        </Stack.Navigator>
    )
}