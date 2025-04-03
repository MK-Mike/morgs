import { createContext, useState, useContext } from "react";

// Create the context
export const LoadingContext = createContext({
  childrenLoaded: false,
  setChildrenLoaded: (loaded: boolean) => {},
});
