import { Button, Divider, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, ImageBg } from "../components";
import { AuthContext, MessageContext } from "../contexts";
import { AuthContextInterface, MessageContextInterface } from "../types";
import { emailSchema } from "../validators";

export const ForgotPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext) as AuthContextInterface;
    const { showMessage } = useContext(
        MessageContext
    ) as MessageContextInterface;

    const navigator = useNavigate();

    const onSubmit = async (values: Record<string, string>) => {
        setLoading(true);
        try {
            await authContext.forgotPassword(values.email);
            showMessage(
                "Password Reset Email Sent. Please check your inbox!",
                "success"
            );
            navigator("/login");
        } catch (err) {
            if (err instanceof FirebaseError) {
                console.trace(err.code);
                if (err.code === "auth/user-not-found") {
                    showMessage("User Not Found", "error");
                }
            }
            setLoading(false);
        }
    };

    return (
        <>
            <div className="relative flex h-full w-screen flex-col items-center justify-around bg-bgColor text-white">
                <ImageBg />
                <div className="container z-20 h-auto w-96 rounded-md bg-textColor p-4 text-bgColor ">
                    <Typography
                        variant="h4"
                        className="text-center text-bgColor"
                    >
                        Forgot Password
                    </Typography>
                    <Divider className="m-4" />
                    <Form
                        buttonText="Send Email"
                        loading={loading}
                        onSubmit={onSubmit}
                        initialValues={{
                            email: "",
                        }}
                        validationSchema={emailSchema}
                        formFields={[
                            {
                                label: "Enter your Email",
                                name: "email",
                                type: "text",
                            },
                        ]}
                    />
                    <Button onClick={() => navigator("/login")}>Login</Button>
                </div>
            </div>
        </>
    );
};
