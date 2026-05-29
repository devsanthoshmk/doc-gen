import React from "react";
import { GenerateContext } from "./GenerateContext";

export const useGenerate = () => {
  const context = React.useContext(GenerateContext);
  if (context === undefined) {
    throw new Error("useGenerate must be used within a GenerateProvider");
  }
  return context;
};
