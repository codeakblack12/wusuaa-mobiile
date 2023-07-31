import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WUSUAA_API } from '../server';

const SocketContext = createContext<any | null>(null);
type ISocketProvider = {
    children: React.ReactNode;
};

const SocketContextProvider = ({ children }: ISocketProvider) => {
    const [token, setToken] = useState("")
    useEffect(() => {
        getTokenn()
    }, [])

    const getTokenn = async () => {
        try {
            const value = await AsyncStorage.getItem("USER_TOKEN");
            if(value !== null){
                setToken(value)
            }
        } catch (error) {

        }
    }

    const socket = io(WUSUAA_API, {
        auth: { authorization: `Bearer ${token}` }
    });

    socket.on('connect', () => {
        socket.emit('authenticate', { token: token }).on('authenticated', () => {console.log('authenticated')});
    });

    socket.on('disconnect', () => {console.log('disconnected')});

    return (
        <SocketContext.Provider value={{ socket, getTokenn }}>
            {children}
        </SocketContext.Provider>
    )
};

export { SocketContext, SocketContextProvider };