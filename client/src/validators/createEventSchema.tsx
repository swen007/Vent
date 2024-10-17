import * as Yup from "yup";

export const createEventSchema = Yup.object({
    name: Yup.string().min(3).max(56).required(),
    desc: Yup.string().min(8).max(1000).required(),
});
