import React from "react";
import styles from "./WhiteBlock.module.scss";
import clsx from "clsx";

export const WhiteBlock = ({ children, className }) => {
   return <div className={clsx(styles.block, className)}>{children}</div>;
};
