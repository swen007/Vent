import * as Yup from "yup";

export const loginSchema = Yup.object({
    email: Yup.string()
        .email("Please Make sure that your email is valid")
        .required("Please Enter your email"),
    password: Yup.string()
        .min(6, "Must be Atleast 6 characters long")
        .required("Please Enter your password"),
});
