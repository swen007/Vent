import { Button, Divider, Modal, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";
import { useContext, useState } from "react";
import { Form } from "..";
import { AuthContext, MessageContext } from "../../contexts";
import { AuthContextInterface, MessageContextInterface } from "../../types";
import { editPasswordSchema } from "../../validators";

interface PropsInterface {
    open: boolean;
    handleClose(): void;
}

export const EditPassword = ({ open, handleClose }: PropsInterface) => {
    const [loading, setLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext) as AuthContextInterface;
    const { showMessage } = useContext(
        MessageContext
    ) as MessageContextInterface;

    const onSubmit = async (values: Record<string, string>) => {
        setLoading(true);
        try {
            await authContext.reauth(values.password);
            await authContext.updateUserPassword(values.newPassword);
            showMessage("Password Updated Successfully!", "success");
            handleClose();
        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/wrong-password") {
                    showMessage(
                        "Wrong Password. Please recheck your password",
                        "error"
                    );
                }
                console.trace(e.code);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <>
                <div className="absolute left-1/2 top-1/2 w-10/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-textColor p-5 text-bgColor">
                    <Typography variant="h4" className="text-center">
                        Change Password
                    </Typography>
                    <Divider className="m-4" />
                    <div className="mb-2 flex flex-col">
                        <Form
                            buttonText="Update Password"
                            loading={loading}
                            onSubmit={onSubmit}
                            initialValues={{
                                password: "",
                                newPassword: "",
                            }}
                            validationSchema={editPasswordSchema}
                            formFields={[
                                {
                                    label: "Confirm Your Password",
                                    name: "password",
                                    type: "password",
                                },
                                {
                                    label: "Enter your new password",
                                    name: "newPassword",
                                    type: "password",
                                },
                            ]}
                        />
                        <Button
                            className="w-full"
                            variant="contained"
                            color="warning"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </>
        </Modal>
    );
};
