import {configureStore} from '@reduxjs/toolkit'

import authReducer from '../store/auth-slice/index.js'
import cartReducer from "../store/cart-slice/index.js";
import wishlistReducer from "../store/wishlist-slice/index.js";
import addressReducer from "../store/address-slice/Index.js";
import orderReducer from '../store/order-slice/Index.js'
import dashboardReducer from '../store/dashboard-slice/Index.js'
const store = configureStore({
    reducer:{
        auth:authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        address: addressReducer,
        order: orderReducer,
        dashboard: dashboardReducer,
    }
})

export default store