import * as Yup from "yup";

export const createEventSchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).max(56).required(),
        desc: Yup.string().min(8).max(1000).required(),
    }),
});

export const fetchEventSchema = Yup.object({
    query: Yup.object({
        uid: Yup.string().min(1).max(128).required(),
    }),
});
