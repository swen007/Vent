import { MessageContextInterface } from "../types";
import { createContext } from "react";

export const MessageContext = createContext<MessageContextInterface | null>(
    null
);
