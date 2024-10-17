import * as Yup from "yup";

export const userSignUpSchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).max(32).required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
        role: Yup.string().min(1).max(128).required(),
    }),
});

export const userUpdateSchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).max(32),
        email: Yup.string().email(),
        password: Yup.string().min(6),
        role: Yup.string().min(1).max(128),
    }),
});

export const loginUserSchema = Yup.object({
    body: Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
    }),
});

export const fetchUserSchema = Yup.object({
    query: Yup.object({
        uid: Yup.string().min(1).max(128).required(),
    }),
});
