import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendPost, getRequest, doPost } from "../../server";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    userData: {},
    userToken: '',
    active_warehouse: null,
    loggedIn: false,
    loading: false,
    error: null,
}

export const LoginUser = createAsyncThunk(
    'user/loginUser',
    async (payload) => {
        const response = await doPost("auth/login", payload)
        return response
    }
)

export const getMe = createAsyncThunk(
    'user/me',
    async () => {
        const response = await getRequest("users/me")
        return response
    }
)


export const getPrevMe = createAsyncThunk(
    'user/prevme',
    async () => {
        const load = await AsyncStorage.getItem("USER_DATA")
        .then(async value => {
            if(value != null){
                const user_data = JSON.parse(value)
                const payload = user_data
                return payload
            }
        })
        if(load){
            return load
        }
    }
)

export const changeWarehouse = createAsyncThunk(
    'user/changeWarehouse',
    async (payload: string) => {
        return payload
    }
)

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // LOGIN USER
        builder.addCase(LoginUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.loading = false
            state.loggedIn = true
            // state.userData = action.payload
            state.userToken = action.payload?.access_token
            if(action.payload?.access_token){
                AsyncStorage.setItem("USER_TOKEN", action.payload?.access_token)
            }
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            AsyncStorage.setItem("USER_TOKEN", '')
            state.loggedIn = false
            state.loading = false
            // state.error = action.error.message
        })

        // GET ME
        builder.addCase(getMe.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.loading = false
            state.loggedIn = true
            state.userData = action.payload
            AsyncStorage.setItem("USER_DATA", JSON.stringify(action.payload))
        })
        builder.addCase(getMe.rejected, (state, action) => {
            // AsyncStorage.setItem("USER_DATA", '')
            // state.loggedIn = false
            state.loading = false
            // state.error = action.error.message
        })

        // GET PREV ME
        builder.addCase(getPrevMe.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getPrevMe.fulfilled, (state, action) => {
            state.loading = false
            if(action.payload){
                state.loggedIn = true
            }
            state.userData = action.payload
        })
        builder.addCase(getPrevMe.rejected, (state, action) => {
            AsyncStorage.setItem("USER_DATA", '')
            state.loggedIn = false
            state.loading = false
            // state.error = action.error.message
        })

        // CHANGE WAREHOUSE
        builder.addCase(changeWarehouse.pending, (state) => {
        })
        builder.addCase(changeWarehouse.fulfilled, (state, action) => {
            state.active_warehouse = action.payload
        })
        builder.addCase(changeWarehouse.rejected, (state, action) => {
        })
    }
})

export const userState = (state: any) => state.user

export default UserSlice.reducer;