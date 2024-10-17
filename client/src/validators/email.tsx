import * as Yup from "yup";

export const emailSchema = Yup.object({
    email: Yup.string()
        .email("Please Make sure that your email is valid")
        .required("Please Enter your email"),
});
