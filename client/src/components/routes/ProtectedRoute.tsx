import { Navigate } from "react-router-dom";
import { ConditionalRoute } from ".";

interface PropsInterface {
    protectedElement: React.ReactNode;
}

export const ProtectedRoute = ({ protectedElement }: PropsInterface) => {
    return (
        <ConditionalRoute
            loggedInElement={protectedElement}
            unProtectedElement={<Navigate to={"/"} />}
        />
    );
};
