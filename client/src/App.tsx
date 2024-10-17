import { useContext } from "react";
import { Navbar, SideDrawer } from "./components/shared";
import { AuthContext } from "./contexts";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConditionalRoute } from "./components";
import {
    AccountPage,
    AssignedTask,
    Dashboard,
    EventsPage,
    ForgotPassword,
    Login,
    SignUp,
    Tasks,
} from "./pages";

const App = () => {
    const authContext = useContext(AuthContext)!;

    return (
        <>
            {authContext.currentUser && <SideDrawer />}
            {!authContext.currentUser && <Navbar />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <ConditionalRoute
                            loggedInElement={<Navigate to={"/events"} />}
                            unProtectedElement={<Navigate to={"/login"} />}
                        />
                    }
                />
                <Route
                    path="/events"
                    element={
                        <ConditionalRoute
                            loggedInElement={<EventsPage />}
                            unProtectedElement={<Navigate to={"/login"} />}
                        />
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ConditionalRoute
                            loggedInElement={<Tasks />}
                            unProtectedElement={<Navigate to={"/login"} />}
                        />
                    }
                />
                <Route
                    path="/assigned"
                    element={
                        <ConditionalRoute
                            loggedInElement={<AssignedTask />}
                            unProtectedElement={<Navigate to={"/login"} />}
                        />
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ConditionalRoute
                            loggedInElement={<AccountPage />}
                            unProtectedElement={<Navigate to={"/login"} />}
                        />
                    }
                />
                j
                <Route
                    path="/login"
                    element={
                        <ConditionalRoute
                            unProtectedElement={<Login />}
                            loggedInElement={<Navigate to={"/"} />}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <ConditionalRoute
                            unProtectedElement={<SignUp />}
                            loggedInElement={<Navigate to={"/"} />}
                        />
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <ConditionalRoute
                            unProtectedElement={<ForgotPassword />}
                            loggedInElement={<Navigate to={"/"} />}
                        />
                    }
                />
            </Routes>
        </>
    );
};

export default App;
