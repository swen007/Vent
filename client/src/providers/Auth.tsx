import { RawAxiosRequestHeaders } from "axios";
import {
    EmailAuthProvider,
    User,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext, RoleContext } from "../contexts";
import { auth, db } from "../firebase";
import { LoadingPage } from "../pages";
import { FetchedUser, UserDetails } from "../types";

interface Props {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
    const [firestoreLoading, setFirestoreLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    const roleContext = useContext(RoleContext)!;

    const loading = firebaseLoading || firestoreLoading;

    const headers = useMemo(() => {
        return {
            Authorization: `Bearer ${token}`,
        } as RawAxiosRequestHeaders;
    }, [token]);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setFirebaseLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        const unsub = auth.onIdTokenChanged((user) => {
            user?.getIdToken().then((resp) => {
                setToken(resp);
            });
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (!currentUser) {
            if (!firebaseLoading) setFirestoreLoading(false);
            return;
        }
        const unsub = onSnapshot(
            doc(db, "usersDetails", currentUser.uid),
            (doc) => {
                let tempUser = doc.data() as FetchedUser;
                setUserDetails({
                    ...tempUser,
                    role: roleContext.getRole(tempUser.role),
                } as UserDetails);
                setFirestoreLoading(false);
            }
        );
        return unsub;
    }, [currentUser, firebaseLoading, roleContext]);

    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };

    const updateUserEmail = (email: string) => {
        return updateEmail(currentUser as User, email);
    };

    const updateUserPassword = (password: string) => {
        return updatePassword(currentUser as User, password);
    };

    const reauth = (password: string) => {
        return reauthenticateWithCredential(
            currentUser as User,
            EmailAuthProvider.credential(currentUser?.email as string, password)
        );
    };

    const forgotPassword = (email: string) => {
        return sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                currentUser,
                logOut,
                logIn,
                updateUserEmail,
                reauth,
                updateUserPassword,
                forgotPassword,
                userDetails,
                headers,
            }}
        >
            {!loading && children}
            {loading && <LoadingPage />}
        </AuthContext.Provider>
    );
};
