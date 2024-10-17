import * as Yup from "yup";

export const editNameSchema = Yup.object({
    name: Yup.string()
        .min(2, "The name needs to be atleast 2 characters")
        .max(32, "The name can be atmost 32 characters long")
        .required("The name is required"),
});
