import { FetchedUser, User } from "../types";
import { adminDb } from "./firebase";
import { getRole } from "./role";

export const getUser = async (uid: string) => {
    const resp = (
        await adminDb.collection("usersDetails").doc(uid).get()
    ).data() as FetchedUser;
    return { ...resp, role: getRole(resp.role) } as User;
};
