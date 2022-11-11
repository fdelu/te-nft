import React from "react";
import { Spinner as SpinnerStrap } from "reactstrap";

type SpinnerProps = {
  text?: string;
};

export const Spinner = ({ text }: SpinnerProps) => {
  return (
    <div className="spinnerContainer">
      <SpinnerStrap />
      <h1 className="px-20 py-10 text-3xl">{text}</h1>
    </div>
  );
};
