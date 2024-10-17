import { AuthContextInterface } from "../types";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextInterface | null>(null);
