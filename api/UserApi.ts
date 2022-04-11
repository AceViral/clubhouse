import { Axios } from "../core/axios";
import { UserInterface } from "../pages";

export const UserApi = {
   getMe: async (): Promise<UserInterface> => {
      const { data } = await Axios.get("/auth/me");
      return data;
   },
};
