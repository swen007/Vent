import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useContext } from "react";
import { Form } from "..";
import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import { FetchedEvent, ValidationSchemaInterface } from "../../types";
import { updateEventSchema } from "../../validators/updateEventSchema";

interface PropsInterface {
    editEvent: boolean;
    handleClose(): void;
    loading: boolean;
    setLoading(arg0: boolean): void;
    event: FetchedEvent;
}

export const EditEvent = ({
    editEvent,
    handleClose,
    loading,
    setLoading,
    event,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;
    return (
        <Dialog
            open={editEvent}
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
            <DialogTitle>Update Event</DialogTitle>
            <DialogContent>
                <Form
                    buttonText="Update Site"
                    loading={loading}
                    initialValues={{
                        name: event.name,
                        desc: event.desc,
                    }}
                    validationSchema={
                        updateEventSchema as unknown as ValidationSchemaInterface
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
                            .patch(
                                `${BACKEND_URI}/event?uid=${event.uid}`,
                                values,
                                {
                                    headers: authContext.headers,
                                }
                            )
                            .then(() => {
                                showMessage(
                                    "The event was updated successfully!",
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
