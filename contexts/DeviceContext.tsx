import { createContext, useContext } from "react";

export const DeviceContext = createContext<"mobile" | "tablet" | "desktop">("desktop");

export const useDevice = () => useContext(DeviceContext);
