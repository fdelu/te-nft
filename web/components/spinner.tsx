import React from "react";
import { Spinner as SpinnerStrap } from "reactstrap";
import styles from "../pages/styles.module.scss";

type SpinnerProps = {
  text?: string;
};

export const Spinner = ({ text }: SpinnerProps) => {
  return (
    <div className="spinnerContainer">
      <SpinnerStrap className={styles.spinner}/>
      <h1 className={styles.loadingText}>{text}</h1>
    </div>
  );
};
