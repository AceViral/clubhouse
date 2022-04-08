import { WelcomeStep } from "../components/steps/WelcomeStep";
import { EnterNameStep } from "../components/steps/EnterNameStep";
import React from "react";
import { ChooseAvatarStep } from "../components/steps/ChooseAvatarStep";
import { EnterPhoneStep } from "../components/steps/EnterPhoneStep";
import { EnterCodeStep } from "../components/steps/EnterCodeStep";
import { GitHubStep } from "../components/steps/GitHubStep";

const stepsComponents = {
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
   // console.log(userData);
   return (
      <MainContext.Provider
         value={{ step, onNextStep, userData, setUserData, setFieldValue }}
      >
         <Step />
      </MainContext.Provider>
   );
}
