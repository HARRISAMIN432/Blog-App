import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import AdminReducer from "./src/redux/adminSlice.js";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  admin: AdminReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
