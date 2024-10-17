import { Button, Divider, Modal, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { Form } from "..";
import { AuthContext, MessageContext } from "../../contexts";
import { AuthContextInterface, MessageContextInterface } from "../../types";
import { editNameSchema } from "../../validators";
import { BACKEND_URI } from "../../constants";

interface PropsInterface {
    open: boolean;
    handleClose(): void;
}

export const EditName = ({ open, handleClose }: PropsInterface) => {
    const [loading, setLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext) as AuthContextInterface;
    const { showMessage } = useContext(
        MessageContext
    ) as MessageContextInterface;

    const onSubmit = async (values: Record<string, string>) => {
        setLoading(true);
        try {
            await axios.patch(
                `${BACKEND_URI}/user/updateUser?uid=${authContext.currentUser?.uid}`,
                {
                    name: values.name,
                },
                {
                    headers: authContext.headers,
                }
            );
            showMessage("Display Name Updated Successfully!", "success");
            handleClose();
        } catch (e) {
            console.trace(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <>
                <div className="absolute left-1/2 top-1/2 w-10/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-textColor p-5 text-bgColor">
                    <Typography variant="h4" className="text-center">
                        Edit Name
                    </Typography>
                    <Divider className="m-4" />
                    <div className="mb-2 flex flex-col">
                        <Form
                            buttonText="Update Name"
                            loading={loading}
                            onSubmit={onSubmit}
                            initialValues={{
                                name: "",
                            }}
                            validationSchema={editNameSchema}
                            formFields={[
                                {
                                    label: "Enter the updated name",
                                    name: "name",
                                    type: "text",
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
