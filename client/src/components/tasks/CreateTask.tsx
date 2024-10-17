import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { Form } from "../../components";
import { AuthContext, MessageContext } from "../../contexts";
import {
    FetchedEvent,
    UserDetails,
    ValidationSchemaInterface,
} from "../../types";
import axios, { AxiosError } from "axios";
import { useContext } from "react";
import { BACKEND_URI } from "../../constants";
import { createTaskSchema } from "../../validators/createTaskSchema";

interface PropsInterface {
    addTask: boolean;
    handleClose(): void;
    loading: boolean;
    setLoading(arg0: boolean): void;
    events: FetchedEvent[];
    users: UserDetails[];
}

export const CreateTask = ({
    addTask,
    handleClose,
    loading,
    setLoading,
    users,
    events,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;

    return (
        <Dialog
            open={addTask}
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
            <DialogTitle>Add a new Task</DialogTitle>
            <DialogContent>
                <Form
                    buttonText="Create Task"
                    loading={loading}
                    initialValues={{
                        name: "",
                        desc: "",
                        projectId: "",
                        assignedTo: "",
                        dueDate: "",
                    }}
                    validationSchema={
                        createTaskSchema as unknown as ValidationSchemaInterface
                    }
                    formFields={[
                        {
                            type: "text",
                            name: "name",
                            label: "Name",
                        },
                        {
                            type: "text",
                            name: "desc",
                            label: "Description",
                        },
                        {
                            type: "option",
                            name: "projectId",
                            label: "Event Name",
                            choices: events.map((event) => {
                                return { label: event.name, value: event.uid };
                            }),
                        },
                        {
                            type: "option",
                            name: "assignedTo",
                            label: "Assign To",
                            choices: users
                                .filter((user) => {
                                    return (
                                        user.role.accessLevel <=
                                        authContext.userDetails!.role
                                            .accessLevel
                                    );
                                })
                                .map((user) => {
                                    return {
                                        label: `${user.name} - ${user.role.roleName} (${user.email})`,
                                        value: user.uid,
                                    };
                                }),
                        },
                        {
                            type: "text",
                            label: "Due Date (dd/mm/yyyy): ",
                            name: "dueDate",
                        },
                    ]}
                    onSubmit={(values: Record<string, string>) => {
                        setLoading(true);
                        axios
                            .post(`${BACKEND_URI}/task`, values, {
                                headers: authContext.headers,
                            })
                            .then(() => {
                                showMessage(
                                    "Task created successfully!",
                                    "success"
                                );
                                handleClose();
                            })
                            .catch((e) => {
                                if (e instanceof AxiosError) {
                                    showMessage(
                                        e.response?.data.message ||
                                            "There was an error",
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
