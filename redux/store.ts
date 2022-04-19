import { combineReducers, configureStore, Store } from "@reduxjs/toolkit";
import { roomsReducer } from "./slices/roomsSlice";
import { createWrapper } from "next-redux-wrapper";
import { RootState } from "./types";
import { userReducer } from "./slices/userSlice";

export const rootReducer = combineReducers({
   rooms: roomsReducer,
   user: userReducer,
});

export const makeStore = (): Store<RootState> =>
   configureStore({
      reducer: rootReducer,
   });

export const wrapper = createWrapper(makeStore, { debug: true });
