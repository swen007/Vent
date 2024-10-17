import * as Yup from "yup";

export const updateEventSchema = Yup.object({
    name: Yup.string().min(3).max(56),
    desc: Yup.string().min(8).max(1000),
});
