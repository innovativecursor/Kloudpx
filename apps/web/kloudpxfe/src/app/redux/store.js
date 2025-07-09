"use client";
import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loadingReducer from "./loadingReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loadingReducer"],
};

const rootReducer = combineReducers({
  loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__?.()
);

export const persistor = persistStore(store);
