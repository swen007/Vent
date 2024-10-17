import { Button, Divider, Typography } from "@mui/material";
import axios from "axios";
import { FirebaseError } from "firebase/app";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, ImageBg } from "../components";
import { BACKEND_URI } from "../constants";
import { MessageContext, RoleContext } from "../contexts";
import { signUpSchema } from "../validators/signUp";

export const SignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { showMessage } = useContext(MessageContext)!;
    const navigator = useNavigate();
    const roleContext = useContext(RoleContext)!;

    const onSubmit = async (values: Record<string, string>) => {
        setLoading(true);
        try {
            const resp = await axios.post(`${BACKEND_URI}/user/signup`, values);
            console.log(resp.data);
            showMessage("User Created Successfully! Please Login.", "success");
            navigator("/login");
        } catch (err) {
            if (err instanceof FirebaseError) {
                if (err.code === "auth/user-not-found") {
                    showMessage("User Not Found", "error");
                }
                if (err.code === "auth/wrong-password") {
                    showMessage("Wrong Password", "error");
                }
                if (err.code === "auth/too-many-requests") {
                    showMessage(
                        "Too Many Request. Please try again later.",
                        "error"
                    );
                }
                console.trace(err.code);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-full w-screen flex-col items-center justify-around">
            <ImageBg />
            <div className="container z-10 h-auto w-96 rounded-md bg-textColor p-4 text-black">
                <Typography variant="h4" className="text-center text-bgColor">
                    Sign Up
                </Typography>
                <Divider className="m-4" />
                <Form
                    buttonText="Create Account"
                    loading={loading}
                    onSubmit={onSubmit}
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={signUpSchema}
                    formFields={[
                        {
                            label: "Enter your name",
                            name: "name",
                            type: "text",
                        },
                        {
                            label: "Enter your Email",
                            name: "email",
                            type: "text",
                        },
                        {
                            label: "Enter your password",
                            name: "password",
                            type: "text",
                        },
                        {
                            type: "option",
                            label: "User Role",
                            choices: roleContext.rolesChoices,
                            name: "role",
                        },
                    ]}
                />
                <Button onClick={() => navigator("/forgot-password")}>
                    Forgot Password?
                </Button>
                <div className="flex items-center justify-center gap-2 text-bgColor">
                    Already have an account?{" "}
                    <Button onClick={() => navigator("/login")}>Login</Button>
                </div>
            </div>
        </div>
    );
};
