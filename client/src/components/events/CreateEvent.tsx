import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { Form } from "..";
import { AuthContext, MessageContext } from "../../contexts";
import { ValidationSchemaInterface } from "../../types";
// import { createSiteSchema } from "@validators";
import axios, { AxiosError } from "axios";
import { useContext } from "react";
import { BACKEND_URI } from "../../constants";
import { createEventSchema } from "../../validators/createEventSchema";

interface PropsInterface {
    addEvent: boolean;
    handleClose(): void;
    loading: boolean;
    setLoading(arg0: boolean): void;
}

export const CreateEvent = ({
    addEvent,
    handleClose,
    loading,
    setLoading,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;

    return (
        <Dialog
            open={addEvent}
            onClose={
                loading
                    ? () => {
                          showMessage(
                              "Can't close the dialog box right now. Deleting the given user.",
                              "warning"
                          );
                      }
                    : handleClose
            }
            color="primary"
        >
            <DialogTitle>Add a new Event</DialogTitle>
            <DialogContent>
                <Form
                    buttonText="Create Event"
                    loading={loading}
                    initialValues={{
                        name: "",
                        desc: "",
                    }}
                    validationSchema={
                        createEventSchema as unknown as ValidationSchemaInterface
                    }
                    formFields={[
                        {
                            type: "text",
                            label: "Name",
                            name: "name",
                        },
                        {
                            type: "text",
                            label: "Description",
                            name: "desc",
                        },
                    ]}
                    onSubmit={(values: Record<string, string>) => {
                        setLoading(true);
                        axios
                            .post(`${BACKEND_URI}/event`, values, {
                                headers: authContext.headers,
                            })
                            .then((resp) => {
                                showMessage(
                                    "The event was created successfully!",
                                    "success"
                                );
                                handleClose();
                            })
                            .catch((e) => {
                                if (e instanceof AxiosError) {
                                    showMessage(
                                        e.response?.data.message,
                                        "error"
                                    );
                                }
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="warning"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
