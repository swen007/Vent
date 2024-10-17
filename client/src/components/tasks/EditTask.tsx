import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useContext, useMemo } from "react";
import { Form } from "..";
import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import {
    FetchedEvent,
    FetchedTask,
    UserDetails,
    ValidationSchemaInterface,
} from "../../types";
import { createTaskSchema } from "../../validators/createTaskSchema";
import { getElementByUid } from "../../utils";

interface PropsInterface {
    editTask: boolean;
    handleClose(): void;
    loading: boolean;
    setLoading(arg0: boolean): void;
    task: FetchedTask;
    events: FetchedEvent[];
    users: UserDetails[];
}

export const EditTask = ({
    editTask,
    handleClose,
    loading,
    setLoading,
    task,
    events,
    users,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;

    const event = useMemo(() => {
        return getElementByUid(events, task.projectId);
    }, [events, task.projectId]);

    const user = useMemo(() => {
        return getElementByUid(users, task.assignedTo);
    }, [users, task.assignedTo]);

    return (
        <Dialog
            open={editTask}
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
            <DialogTitle>Update Task</DialogTitle>
            <DialogContent>
                <Form
                    buttonText="Update Task"
                    loading={loading}
                    initialValues={{
                        name: task.name,
                        desc: task.desc,
                        projectId: task.projectId,
                        assignedTo: task.assignedTo,
                        dueDate: task.dueDate,
                    }}
                    validationSchema={
                        createTaskSchema as unknown as ValidationSchemaInterface
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
                        {
                            type: "option",
                            name: "projectId",
                            label: "Event Name",
                            choices: events.map((event) => {
                                return { label: event.name, value: event.uid };
                            }),
                            defaultValue: {
                                label: event?.name,
                                value: event?.uid,
                            },
                        },
                        {
                            type: "option",
                            name: "assignedTo",
                            label: "Assign To",
                            choices: users.map((user) => {
                                return {
                                    label: `${user.name} - ${user.role.roleName} (${user.email})`,
                                    value: user.uid,
                                };
                            }),
                            defaultValue: {
                                label: `${user.name} - ${user.role.roleName} (${user.email})`,
                                value: user?.uid,
                            },
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
                            .patch(
                                `${BACKEND_URI}/task?uid=${task.uid}`,
                                values,
                                {
                                    headers: authContext.headers,
                                }
                            )
                            .then(() => {
                                showMessage(
                                    "The task was updated successfully!",
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
