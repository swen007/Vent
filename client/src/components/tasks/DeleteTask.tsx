import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { FetchedEvent } from "../../types";
import axios from "axios";
import { useContext } from "react";

interface PropsInterface {
    deleteTask: boolean;
    handleClose(): void;
    task?: FetchedEvent;
    loading: boolean;
    setLoading(arg0: boolean): void;
}

export const DeleteTask = ({
    deleteTask,
    handleClose,
    task,
    loading,
    setLoading,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;

    const deleteAccount = () => {
        setLoading(true);
        axios
            .delete(`${BACKEND_URI}/task?uid=${task?.uid}`, {
                headers: authContext.headers,
            })
            .then(() => {
                showMessage("Task Deleted Successfully!", "success");
            })
            .catch((err) => {
                console.trace(err);
                showMessage(
                    "There was an error while deleting the given task. Please try again.",
                    "error"
                );
            })
            .finally(() => {
                setLoading(false);
                handleClose();
            });
    };

    return (
        <Dialog
            open={deleteTask}
            onClose={
                loading
                    ? () => {
                          showMessage(
                              "Can't close the dialog box right now. Deleting the given site.",
                              "warning"
                          );
                      }
                    : handleClose
            }
        >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the task {task?.name}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="success"
                >
                    Disagree
                </Button>
                <Button
                    onClick={deleteAccount}
                    disabled={loading}
                    color="warning"
                >
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
};
