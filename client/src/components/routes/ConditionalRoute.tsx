import React, { useContext } from "react";
import { AuthContext } from "../../contexts";
import { AuthContextInterface } from "../../types";

interface PropsInterface {
    loggedInElement: React.ReactNode;
    unProtectedElement: React.ReactNode;
}

export const ConditionalRoute = ({
    loggedInElement,
    unProtectedElement,
}: PropsInterface) => {
    const authContext = useContext(AuthContext) as AuthContextInterface;

    const { currentUser } = authContext;

    if (currentUser) return <>{loggedInElement}</>;

    return <>{unProtectedElement}</>;
};
