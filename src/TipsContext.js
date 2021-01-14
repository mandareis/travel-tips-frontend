import React from "react";
import { createTravelStore } from "./travelStore";
import { useLocalObservable } from "mobx-react";

const TipsContext = React.createContext(null);

export const TipsProvider = ({ children }) => {
  const travelStore = useLocalObservable(createTravelStore);
  return (
    <TipsContext.Provider value={travelStore}>{children}</TipsContext.Provider>
  );
};
export const useTravelStore = () => React.useContext(TipsContext);
