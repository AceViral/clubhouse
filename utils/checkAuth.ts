import { GetServerSidePropsContext } from "next";
import { Api } from "../api";
import { UserInterface } from "../pages";

export const checkAuth = async (
   ctx: GetServerSidePropsContext
): Promise<UserInterface | null> => {
   try {
      return await Api(ctx).getMe();
   } catch (error) {
      return null;
   }
};
