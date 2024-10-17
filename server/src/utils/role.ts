import createHttpError from "http-errors";
import { Role, Roles } from "../types";
import { adminDb } from "./firebase";

const roles: Roles = {};

export const getRole = (uid: string) => {
    if (uid in roles) return roles[uid];
    throw new createHttpError.BadRequest("The given role was not found.");
};

export const getRoles = () => {
    return roles;
};

export const fetchRoles = async () => {
    const data = (await adminDb.collection("roles").get()).docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as Role & { uid: string };
    });
    data.forEach(({ uid, accessLevel, roleName }) => {
        roles[uid] = { roleName, accessLevel };
    });
};
