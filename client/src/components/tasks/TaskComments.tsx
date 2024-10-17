import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { TaskComment } from ".";
import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import { FetchedTask, TaskCommentInterface, UserDetails } from "../../types";
import { Form } from "..";
import { commentSchema } from "../../validators/commentSchema";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { getElementByUid } from "../../utils";

interface PropsInterface {
    deleteTask: boolean;
    handleClose(): void;
    task?: FetchedTask;
    loading: boolean;
    setLoading(arg0: boolean): void;
    users: UserDetails[];
}

export const TaskComments = ({
    deleteTask,
    handleClose,
    task,
    loading,
    setLoading,
    users,
}: PropsInterface) => {
    const { showMessage } = useContext(MessageContext)!;
    const authContext = useContext(AuthContext)!;

    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const [comments, setComments] = useState<TaskCommentInterface[]>([]);

    useEffect(() => {
        if (!task) return;
        const unsub = onSnapshot(
            collection(db, "tasks", task.uid, "comments"),
            (docsRef) => {
                setCommentLoading(true);
                const tempComments: TaskCommentInterface[] = [];
                docsRef.docs.forEach((doc) => {
                    const time = dayjs(
                        doc.data().createdAt.seconds * 1000
                    ).format();
                    const user = getElementByUid(users, doc.data().userId);
                    const comment = doc.data().comment;
                    tempComments.push({ comment, user, time });
                });
                setTimeout(() => setCommentLoading(false));
                console.log(tempComments);
                console.log(tempComments.length);
                setComments(
                    tempComments.sort((a, b) => {
                        const x = dayjs(a.time);
                        const y = dayjs(b.time);
                        console.log(x);
                        console.log(y);
                        if (x.isBefore(y)) {
                            return 1;
                        }
                        if (y.isBefore(x)) {
                            return -1;
                        }
                        return 0;
                    })
                );
            }
        );
        return unsub;
    }, [authContext.userDetails, task, users]);

    return (
        <Dialog
            open={deleteTask}
            fullWidth
            onClose={
                loading
                    ? () => {
                          showMessage(
                              "Can't close the dialog box right now.",
                              "warning"
                          );
                      }
                    : handleClose
            }
        >
            <DialogTitle>View Comments</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className="w-full">
                        <Typography
                            className="w-full text-center text-xl font-semibold uppercase tracking-widest"
                            variant="h4"
                        >
                            Comments
                        </Typography>
                        <List
                            sx={{
                                width: "100%",
                            }}
                            className="flex h-96 flex-col items-center overflow-auto"
                        >
                            {comments.map((comment) => {
                                return (
                                    <TaskComment
                                        name={comment.user.name}
                                        time={comment.time}
                                        comment={comment.comment}
                                    />
                                );
                            })}
                        </List>
                        <Form
                            buttonText="Comment"
                            loading={commentLoading}
                            formFields={[
                                {
                                    type: "text",
                                    name: "comment",
                                    label: "Your Comment",
                                },
                            ]}
                            initialValues={{
                                comment: "",
                            }}
                            onSubmit={(values: Record<string, string>) => {
                                setCommentLoading(true);
                                axios
                                    .post(
                                        `${BACKEND_URI}/comment/?uid=${task?.uid}`,
                                        values,
                                        {
                                            headers: authContext.headers,
                                        }
                                    )
                                    .then(() => {
                                        showMessage(
                                            "Commented successfully!",
                                            "success"
                                        );
                                    })
                                    .catch((e) => {
                                        console.trace(e);
                                        showMessage(
                                            "There was an error while commenting. Please try again later.",
                                            "error"
                                        );
                                    })
                                    .finally(() => {
                                        setCommentLoading(false);
                                    });
                            }}
                            validationSchema={commentSchema}
                        />
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    color="warning"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
