/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { MainContext } from "../../../pages";
import { Button } from "../../Button";
import { WhiteBlock } from "../../WhiteBlock";
import styles from "./WelcomeStep.module.scss";

export const WelcomeStep = () => {
   const { onNextStep } = React.useContext(MainContext)
   return (
      <WhiteBlock className={styles.block}>
         <h3 className={styles.title}>
            <img
               src="/static/hand-wave.png"
               alt="Celebration"
               className={styles.handWaveImg}
            />
            Welcome to Clubhouse!
         </h3>
         <p>
            We're working hard to get Clubhouse ready for everyone! While we
            wrap up the finishing youches, we're adding people gradually to make
            sure nothing breaks :)
         </p>
         <div>
            <Button onClick={ onNextStep }>
               Get your username
               <img
                  src="/static/arrow.svg"
                  alt="Arrow"
                  className="d-ib ml-10"
               />
            </Button>
         </div>
         <div className="link mt-15 cup d-ib">Have an invite text? Sign in</div>
      </WhiteBlock>
   );
};
