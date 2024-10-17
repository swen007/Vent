import { UserDetails } from "../types";

export const objectLength = <T extends Record<PropertyKey, unknown>>(
    obj: T
) => {
    return Object.keys(obj).length;
};

export const removeFalseyValues = <T extends object>(obj: T) => {
    let newObj: Partial<T> = {};
    const keys = Object.keys(obj) as (keyof T)[];
    keys.forEach((key) => {
        if (obj[key]) {
            newObj = { ...newObj, [key]: obj[key] };
        }
    });
    return newObj;
};

export const getElementByUid = <T extends { uid: string }>(
    arr: T[],
    uid: string
) => {
    return arr.filter((el) => el.uid === uid).at(0)!;
};
