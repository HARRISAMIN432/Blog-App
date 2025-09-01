import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import AdminReducer from "./src/redux/AdminSlice";
import UserReducer from "./src/redux/userSlice";

const rootReducer = combineReducers({
  admin: AdminReducer,
  user: UserReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
