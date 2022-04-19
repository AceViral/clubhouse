import { WelcomeStep } from "../components/steps/WelcomeStep";
import { EnterNameStep } from "../components/steps/EnterNameStep";
import React from "react";
import { ChooseAvatarStep } from "../components/steps/ChooseAvatarStep";
import { EnterPhoneStep } from "../components/steps/EnterPhoneStep";
import { EnterCodeStep } from "../components/steps/EnterCodeStep";
import { GitHubStep } from "../components/steps/GitHubStep";
import { checkAuth } from "../utils/checkAuth";
import { Axios } from "../core/axios";
import { Api } from "../api";
import { GetServerSideProps } from "next";
import { wrapper } from "../redux/store";

const stepsComponents: any = {
   0: WelcomeStep,
   1: GitHubStep,
   2: EnterNameStep,
   3: ChooseAvatarStep,
   4: EnterPhoneStep,
   5: EnterCodeStep,
};

export type UserInterface = {
   id: number;
   fullname: string;
   avatarUrl: string;
   isActive: number;
   username: string;
   phone: string;
   token?: string;
};

type MainContextProps = {
   onNextStep: () => void;
   setUserData: React.Dispatch<React.SetStateAction<UserInterface>>;
   setFieldValue: (field: keyof UserInterface, value: string) => void;
   step: number;
   userData?: UserInterface;
};

export const MainContext = React.createContext<MainContextProps>(
   {} as MainContextProps
);

const getUserData = (): UserInterface | null => {
   try {
      return JSON.parse(String(window.localStorage.getItem("userData")));
   } catch (error) {
      return null;
   }
};

const getFormStep = (): number => {
   const json = getUserData();
   if (json) {
      if (json.phone) {
         return 5;
      } else {
         return 4;
      }
   }
   return 0;
};

export default function Home() {
   const [step, setStep] = React.useState<number>(0);
   const [userData, setUserData] = React.useState<UserInterface>();
   const Step = stepsComponents[step];

   const onNextStep = () => {
      setStep((prev) => prev + 1);
   };

   const setFieldValue = (field: string, value: string) => {
      setUserData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   React.useEffect(() => {
      if (typeof window !== "undefined") {
         const json = getUserData();
         if (json) {
            setUserData(json);
            setStep(getFormStep());
         }
      }
   }, []);

   React.useEffect(() => {
      if (userData) {
         window.localStorage.setItem("userData", JSON.stringify(userData));
         Axios.defaults.headers.Authorization = "Bearer " + userData.token;
      }
   }, [userData]);

   return (
      <MainContext.Provider
         value={{ step, onNextStep, userData, setUserData, setFieldValue }}
      >
         <Step />
      </MainContext.Provider>
   );
}

export const getServerSideProps: GetServerSideProps =
   wrapper.getServerSideProps((store) => async (ctx) => {
      try {
         const user = await checkAuth(ctx, store);
         Api(ctx).getMe();
         if (user) {
            return {
               props: {},
               redirect: {
                  destination: "/rooms",
                  permanent: false,
               },
            };
         }
      } catch (err) {}

      return { props: {} };
   });
