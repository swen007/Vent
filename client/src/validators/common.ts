import * as Yup from "yup";

export const emailField = (required = true) => {
    const temp = Yup.string().email("Must be a valid email");
    if (required) return temp.required("Email is required");
    return temp;
};

export const uidField = (required = true, account = "") => {
    const temp = Yup.string()
        .min(1, `The minimum length of the ${account} UID is 1.`)
        .max(128, `The maximum length of the ${account} UID is 128.`)
        .nullable();
    if (required) return temp.required(`The ${account} UID is required`);
    return temp;
};

export const passwordField = (required = true) => {
    const temp = Yup.string().min(6, "Password must be atleast 6 letters long");
    if (required) return temp.required("Password is required");
    return temp;
};

export const displayNameField = (required = true) => {
    const temp = Yup.string()
        .min(3, "The minimum character length of the display name is 3.")
        .max(32, "The maximum character length of the display name is 32.");
    if (required) return temp.required("The Display Name is required");
    return temp;
};
