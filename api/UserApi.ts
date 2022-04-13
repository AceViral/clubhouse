import { AxiosInstance } from "axios";
import { UserInterface } from "../pages";

export const UserApi = (instance: AxiosInstance) => {
   return {
      getMe: async (): Promise<UserInterface> => {
         const { data } = await instance.get("/auth/me");
         return data;
      },
   };
};
