import React from "react";
import { Spinner as SpinnerStrap } from "reactstrap";
import styles from "../pages/styles.module.scss";

type SpinnerProps = {
  text?: string;
};

export const Spinner = ({ text }: SpinnerProps) =>
  <div className={styles.spinnerBackground}>
    <div className={styles.spinnerContainer}>
      <SpinnerStrap className={styles.spinner} />
      <div className={styles.loadingText}>{text}</div>
    </div>
  </div>

