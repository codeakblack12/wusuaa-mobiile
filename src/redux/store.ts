import { configureStore } from '@reduxjs/toolkit'

import UserReducer from "./slices/userSlice"
import InventoryReducer from "./slices/inventorySlice"
import SalesReducer from "./slices/salesSlice"

export const store = configureStore({
  reducer: {
    user: UserReducer,
    inventory: InventoryReducer,
    sales: SalesReducer
  },
})