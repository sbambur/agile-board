import { useContext } from "react";
import { StoreContext } from "../context";

export default function useStore() {
  return useContext(StoreContext);
}
