import * as Yup from "yup";

export const commentSchema = Yup.object({
    comment: Yup.string().max(1000).required(),
});
