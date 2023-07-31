import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendPost, getRequest, doPost, sendDelete } from "../../server";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    scanned_inventory: [],
    dockyard_cart: [],
    categories: [],
    loading: false,
    error: null,
}

export const addItem = createAsyncThunk(
    'inventory/add',
    async (payload: any) => {
        return payload
    }
)

export const removeItem = createAsyncThunk(
    'inventory/remove',
    async (payload: string) => {
        const response = await sendDelete(`inventory/remove/${payload}`, {})
        return payload
    }
)

export const getCategories = createAsyncThunk(
    'inventory/categories',
    async (payload: string) => {
        const response = await getRequest(`inventory/category`)
        return response.data
    }
)

export const addToDockyardCart = createAsyncThunk(
    'inventory/dockyard-add',
    async (payload) => {
        return payload
    }
)

const InventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ADD ITEM
        builder.addCase(addItem.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addItem.fulfilled, (state, action) => {
            // let arr = state.scanned_inventory
            // arr.push(action.payload)
            state.scanned_inventory = [...state.scanned_inventory, action.payload]
            state.loading = false
        })
        builder.addCase(addItem.rejected, (state, action) => {
            state.loading = false
        })

        // REMOVE ITEM
        builder.addCase(removeItem.pending, (state) => {
            state.loading = true
        })
        builder.addCase(removeItem.fulfilled, (state, action) => {
            state.scanned_inventory = state.scanned_inventory.filter((val: any) => {
                if(val.uid !== action.payload){
                    return val
                }
            })
            state.loading = false
        })
        builder.addCase(removeItem.rejected, (state, action) => {
            state.loading = false
        })

        // GET CATEGORIES
        builder.addCase(getCategories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload
            state.loading = false
        })
        builder.addCase(getCategories.rejected, (state, action) => {
            state.loading = false
        })

        // ADD TO DOCKYARD CART
        builder.addCase(addToDockyardCart.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addToDockyardCart.fulfilled, (state, action) => {
            const check = state.dockyard_cart.filter((val: any) => {
                if(val.barcode === action.payload.barcode){
                    return val
                }
            })
            if(check.length > 0){
                alert("Item already scanned")
            }else{
                let arr = state.dockyard_cart
                arr.push(action.payload)
                state.dockyard_cart = arr
            }
            // state.categories = action.payload
            state.loading = false
        })
        builder.addCase(addToDockyardCart.rejected, (state, action) => {
            state.loading = false
        })
    }
})

export const inventoryState = (state: any) => state.inventory

export default InventorySlice.reducer