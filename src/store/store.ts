import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "cart", 
  storage,
};

// Create a persisted reducer for the cart slice
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer, 
  },
});

export const persistor = persistStore(store);

export default store;
