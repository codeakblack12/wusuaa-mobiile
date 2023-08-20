import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendPost, getRequest, doPost } from "../../server";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COUNTER_VALUES, layoutAnimation, linearLayoutAnimation } from "../../utils/constants";

const initialState = {
    carts: [],
    create_dock: false,
    dockyard_carts: <any>[],
    selected_dock_cart: {},
    sectioned_carts: <any>[],
    cart_items: [],
    loading: false,
    error: null,
}

export const getCarts = createAsyncThunk(
    'sales/getcarts',
    async (payload: string) => {
        const response = await getRequest(`sales/warehouse-carts/${payload}`)
        return response.data
    }
)

export const getDockyardCarts = createAsyncThunk(
    'sales/getdockyardcarts',
    async (payload: string) => {
        const response = await getRequest(`sales/dockyard-carts/${payload}`)
        return response.data
    }
)

export const addCart = createAsyncThunk(
    'sales/addCart',
    async (payload) => {
        return payload
    }
)

export const addDockCart = createAsyncThunk(
    'sales/addDockCart',
    async (payload) => {
        return payload
    }
)

export const addItemToCart = createAsyncThunk(
    'sales/addItemToCart',
    async (payload) => {
        return payload
    }
)

export const selectCart = createAsyncThunk(
    'sales/selectCart',
    async (payload) => {
        return payload
    }
)

export const initCreateDockCart = createAsyncThunk(
    'sales/initCreateDockCart',
    async () => {
        return
    }
)

export const selectDockCart = createAsyncThunk(
    'sales/selectDockCart',
    async (payload: string) => {
        return payload
    }
)

export const clearDockCart = createAsyncThunk(
    'sales/clearDockCart',
    async () => {
        return
    }
)

const SalesSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {},
    extraReducers(builder) {
        // GET WAREHOUSE CARTS
        builder.addCase(getCarts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCarts.fulfilled, (state, action) => {
            state.loading = false
            state.carts = action.payload
            state.sectioned_carts = COUNTER_VALUES.map((num) => {
                const title = `Counter ${num}`
                const data = action.payload.filter((val: any) => {
                    if(val.counter === num){
                        return val
                    }
                })
                return {
                    title,
                    data
                }
            }).filter((val) => {if(val.data.length){return val}})
        })
        builder.addCase(getCarts.rejected, (state, action) => {
            state.loading = false
        })

        // GET DOCKYARD CARTS
        builder.addCase(getDockyardCarts.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getDockyardCarts.fulfilled, (state, action) => {
            state.loading = false
            state.dockyard_carts = action.payload.reverse()
        })
        builder.addCase(getDockyardCarts.rejected, (state, action) => {
            state.loading = false
        })

        // ADD CART --- Socket
        builder.addCase(addCart.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addCart.fulfilled, (state, action) => {
            state.loading = false
            state.carts = state.carts.concat([action.payload])
            state.sectioned_carts = COUNTER_VALUES.map((num) => {
                const title = `Counter ${num}`
                const data = state.carts.filter((val: any) => {
                    if(val.counter === num){
                        return val
                    }
                })
                return {
                    title,
                    data
                }
            }).filter((val) => {if(val.data.length){return val}})
        })
        builder.addCase(addCart.rejected, (state, action) => {
            state.loading = false
        })

        // ADD DOCKYARD CART --- Socket
        builder.addCase(addDockCart.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addDockCart.fulfilled, (state, action) => {
            state.loading = false
            let isAvail = false
            const new_dock_cart = state.dockyard_carts.map((val: any) => {
                if(val._id === action.payload._id){
                    isAvail = true
                    return action.payload
                }else{
                    return val
                }
            })

            if(isAvail){
                if(action.payload._id === state.selected_dock_cart._id){
                    state.selected_dock_cart = action.payload
                }
                state.dockyard_carts = new_dock_cart
            }else{
                if(state.create_dock){
                    state.create_dock = false
                    state.selected_dock_cart = action.payload
                }
                state.dockyard_carts = [action.payload, ...state.dockyard_carts]
            }
        })
        builder.addCase(addDockCart.rejected, (state, action) => {
            state.loading = false
        })

        // ADD ITEM TO CART
        builder.addCase(addItemToCart.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addItemToCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart_items = state.cart_items.concat([action.payload])
        })
        builder.addCase(addItemToCart.rejected, (state, action) => {
            state.loading = false
        })

        // SELECT CART
        builder.addCase(selectCart.pending, (state) => {
        })
        builder.addCase(selectCart.fulfilled, (state, action) => {
            state.cart_items = action.payload.items
        })
        builder.addCase(selectCart.rejected, (state, action) => {
        })

        // INITIATE CREATE DOCK CART
        builder.addCase(initCreateDockCart.pending, (state) => {
        })
        builder.addCase(initCreateDockCart.fulfilled, (state, action) => {
            state.create_dock = true
        })
        builder.addCase(initCreateDockCart.rejected, (state, action) => {
        })

        // SELECT DOCK CART
        builder.addCase(selectDockCart.pending, (state) => {
        })
        builder.addCase(selectDockCart.fulfilled, (state, action) => {
            state.create_dock = false
            state.selected_dock_cart = action.payload
            // state.dockyard_carts = []
        })
        builder.addCase(selectDockCart.rejected, (state, action) => {
        })

        // CLEAR DOCK CART
        builder.addCase(clearDockCart.pending, (state) => {
        })
        builder.addCase(clearDockCart.fulfilled, (state, action) => {
            state.dockyard_carts = []
        })
        builder.addCase(clearDockCart.rejected, (state, action) => {
        })
    },
})

export const salesState = (state: any) => state.sales

export default SalesSlice.reducer