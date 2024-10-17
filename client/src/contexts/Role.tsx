import { createContext } from "react";
import { RoleContextInterface } from "../types";

export const RoleContext = createContext<RoleContextInterface | null>(null);
