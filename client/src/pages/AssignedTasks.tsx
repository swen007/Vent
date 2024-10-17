import { Divider, Typography } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { AssignedList, ImageBg } from "../components";
import { AuthContext } from "../contexts";
import { db } from "../firebase";
import { useFetchEvents, useFetchUsers } from "../hooks";
import { FetchedTask } from "../types";
import { filterTasks } from "../utils";

export const AssignedTask = () => {
    const [eventsLoading, setEventsLoading] = useState<boolean>(true);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const lastLength = useRef(0);
    const authContext = useContext(AuthContext)!;
    const [tasks, setTasks] = useState<FetchedTask[]>([]);

    const events = useFetchEvents({ setLoading: setEventsLoading });
    const users = useFetchUsers({ setLoading: setUsersLoading });

    const loading = usersLoading || eventsLoading;

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "tasks"), (docsRef) => {
            const tempTasks: FetchedTask[] = [];
            docsRef.docs.forEach((doc) => {
                const temp = doc.data() as FetchedTask;
                if (
                    lastLength.current !== 0 &&
                    lastLength.current !== docsRef.docs.length
                ) {
                    if (temp.assignedTo === authContext.userDetails?.uid) {
                        alert("New Task Was Just Assigned.");
                    }
                }
                if (temp.assignedTo === authContext.userDetails?.uid)
                    tempTasks.push(temp);
            });
            setTasks(tempTasks);
            lastLength.current = docsRef.docs.length;
        });
        return unsub;
    }, [authContext.userDetails]);

    return (
        <div className="relative ml-[200px] flex h-full w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
            <ImageBg />
            <div className="z-10 flex h-[90%] w-11/12 flex-col rounded-md bg-textColor p-4 text-bgColor">
                <Typography variant="h4" className="text-center">
                    Assigned Tasks
                </Typography>
                <Divider className="my-4" />
                {tasks.length === 0 && (
                    <p className="text-center text-error">No Task Was Found</p>
                )}
                {!loading && tasks.length > 0 && (
                    <div className="flex h-full flex-col gap-4 overflow-hidden text-bgColor">
                        <AssignedList
                            tasks={filterTasks(tasks, false)}
                            events={events}
                            users={users}
                        />
                        <AssignedList
                            tasks={filterTasks(tasks, true)}
                            events={events}
                            users={users}
                            complete
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
