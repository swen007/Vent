import * as Yup from "yup";

export const editPasswordSchema = Yup.object({
    password: Yup.string()
        .min(6, "Must be Atleast 6 characters long")
        .required("You need to confirm your password"),
    newPassword: Yup.string()
        .min(6, "Must be Atleast 6 characters long")
        .required("New Password is required")
        .notOneOf(
            [Yup.ref("password")],
            "Your new password cannot be the same as your old one."
        ),
});
