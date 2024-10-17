import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(6, "Must be Atleast 6 characters long")
        .required("You need to confirm your password"),
    cpassword: Yup.string()
        .min(6, "Must be Atleast 6 characters long")
        .required("New Password is required")
        .oneOf([Yup.ref("password")], "Both the passwords need to match"),
});
