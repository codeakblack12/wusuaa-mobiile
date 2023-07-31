import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import React, { useEffect, useRef, useCallback, useState, useContext } from 'react';
import { enableScreens } from 'react-native-screens';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStack } from './StackNavigation';
import Dashboard from '../screens/main/dashboard';
import Inventory from '../screens/main/inventory';
import Sales from '../screens/main/sales';
import Security from '../screens/main/security';
import Dockyard from '../screens/main/dockyard';
import DockyardCart from '../screens/main/dockyard/cart';
import DockyardCheckout from '../screens/main/dockyard/checkout';
import { BottomSheetTransition } from '../utils/constants';
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPrevMe } from '../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { SocketContext } from '../context/socket';
import { userState } from '../redux/slices/userSlice';
import { addCart, addDockCart } from '../redux/slices/salesSlice';
import SecurityCart from '../screens/main/security/receipt';
import SecurityComplete from '../screens/main/security/complete';
import Profile from '../screens/main/profile';
import AwaitingPayment from '../screens/main/dockyard/awaitingpayment';
import ScanToPay from '../screens/main/dockyard/scantopay';

enableScreens();
const navigationRef = createNavigationContainerRef();
const RootStack = createStackNavigator();

function App() {

    const dispatch = useAppDispatch()

    const { userData } = useAppSelector(userState)

    const isAdmin = userData?.role?.includes("SUPER_ADMIN") || userData?.role?.includes("ADMIN") || userData?.role?.includes("MANAGER")

    const { socket } = useContext(SocketContext);

    const [isAuth, setIsAuth] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        checkIsAuth()
    }, [])

    useEffect(() => {
        if(userData?.warehouse?.length && (isAdmin || userData?.role.includes("SALES"))){
            socket.on(`SALES-${userData?.warehouse[0]}`, (payload: any) => {
                dispatch(addCart(payload))
            })

            socket.on(`DOCKYARD-${userData?.warehouse[0]}`, (payload: any) => {
                console.log(payload)
                dispatch(addDockCart(payload))
            })

            return () => {
                socket.off(`SALES-${userData?.warehouse[0]}`);
                socket.off(`DOCKYARD-${userData?.warehouse[0]}`);
            };
        }

        // if(userData?.warehouse?.length && (isAdmin || userData?.role.includes("INVENTORY_MANGEMENT"))){
        //     socket.on(`INVENTORY-${userData?.warehouse[0]}`, (payload: any) => {
        //         console.log(payload)
        //     })

        //     return () => {
        //         socket.off(`INVENTORY-${userData?.warehouse[0]}`);
        //     };
        // }

    }, [userData, socket])

    const checkIsAuth = async () => {
        try {
            const token = await AsyncStorage.getItem("USER_TOKEN");
            console.log(token)
            if(token){
                console.log("Authenticated")
                setIsAuth(true)
                await dispatch(getPrevMe())
                setChecked(true)
                setTimeout(() => {
                    SplashScreen.hide()
                }, 1000)
            }else{
                setChecked(true)
                SplashScreen.hide()
            }
        } catch (error) {
            setChecked(true)
            console.log(error)
            SplashScreen.hide()
        }
    }

    if(!checked){
        return <View/>
    }


    return (
        <View style={{flex: 1}}>
            <RootStack.Navigator
            initialRouteName={isAuth ? "dashboard" : "auth"}
            // initialRouteName={"auth"}
            screenOptions={{
                headerShown: false,
                // gestureEnabled: true,
                // gestureDirection: 'vertical'
            }}
            >
                <RootStack.Screen name="auth" component={AuthStack} options={BottomSheetTransition} />
                <RootStack.Screen name="dashboard" component={Dashboard} options={BottomSheetTransition} />
                <RootStack.Screen name="profile" component={Profile} options={BottomSheetTransition} />
                <RootStack.Screen name="inventory" component={Inventory}
                options={{}}
                />
                <RootStack.Screen name="sales" component={Sales}
                options={{}}
                />
                <RootStack.Screen name="security" component={Security}
                options={{}}
                />
                <RootStack.Screen name="securitycart" component={SecurityCart}
                options={{}}
                />
                <RootStack.Screen name="securitycomplete" component={SecurityComplete}
                options={{}}
                />
                <RootStack.Screen name="dockyard" component={Dockyard}
                options={{}}
                />
                <RootStack.Screen name="dockyardcart" component={DockyardCart}
                options={{}}
                />
                <RootStack.Screen name="dockyardcheckout" component={DockyardCheckout}
                options={{}}
                />
                <RootStack.Screen name="awaitingpayment" component={AwaitingPayment}
                options={{}}
                />
                <RootStack.Screen name="scantopay" component={ScanToPay}
                options={{}}
                />
            </RootStack.Navigator>
        </View>
    )
}

export default function AppNavigator() {

    return(
        <NavigationContainer
            // onReady={() => SplashScreen.hide()}
        >
            <App />
        </NavigationContainer>
    )
}