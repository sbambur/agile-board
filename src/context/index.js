import { createContext } from "react";
import RootStore from "../store";

const store = RootStore.create({});
export const StoreContext = createContext(store);

export function StoreContextProvider({ children }) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
