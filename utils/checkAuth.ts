import { Store } from "@reduxjs/toolkit";
import { GetServerSidePropsContext } from "next/types";
import { Api } from "../api";
import { UserInterface } from "../pages";
import { setUserData } from "../redux/slices/userSlice";
import { RootState } from "../redux/types";

// TODO: Типизировать
// export const checkAuth = async (
//    ctx: any & {
//       store: Store<RootState>;
//    }
// ): Promise<UserInterface | null> => {
//    try {
//       // return await Api(ctx).getMe();
//       const user = await Api(ctx).getMe();
//       ctx.store.dispatch(setUserData(user));
//       return user;
//    } catch (error) {
//       return null;
//    }
// };
export const checkAuth = async (
   ctx: GetServerSidePropsContext,
   store: Store<RootState>
): Promise<UserInterface | null> => {
   try {
      const user = await Api(ctx).getMe();
      store.dispatch(setUserData(user));
      return user;
   } catch (error) {
      return null;
   }
};
