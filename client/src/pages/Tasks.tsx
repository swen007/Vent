import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { CreateTask, ImageBg, TasksList } from "../components";
import { useFetchEvents, useFetchTasks, useFetchUsers } from "../hooks";
import { filterTasks } from "../utils";

export const Tasks = () => {
    const [eventsLoading, setEventsLoading] = useState<boolean>(true);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const [tasksLoading, setTasksLoading] = useState<boolean>(true);
    const [tasksFetch, setTasksFetch] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<boolean>(false);

    const loading = eventsLoading || tasksLoading || usersLoading;

    const events = useFetchEvents({ setLoading: setEventsLoading });
    const tasks = useFetchTasks({ tasksFetch, setLoading: setTasksLoading });
    const users = useFetchUsers({ setLoading: setUsersLoading });

    return (
        <div className="relative ml-[200px] flex h-full w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
            <ImageBg />
            <div className="z-10 flex h-[94%] w-11/12 flex-col rounded-md bg-textColor p-4 text-bgColor">
                <Typography variant="h4" className="text-center">
                    Task Management
                </Typography>
                <Divider className="my-4" />
                <div className="mb-4 flex w-full justify-end">
                    <Button
                        disabled={loading}
                        variant="contained"
                        color="secondary"
                        onClick={() => setAddTask(true)}
                    >
                        Add New Task
                    </Button>
                </div>
                {!loading && events.length !== 0 && (
                    <CreateTask
                        loading={tasksFetch}
                        setLoading={setTasksFetch}
                        addTask={addTask}
                        handleClose={() => setAddTask(false)}
                        events={events}
                        users={users}
                    />
                )}
                {loading && (
                    <div className="flex justify-center">
                        <CircularProgress color="secondary" />
                    </div>
                )}
                {tasks.length === 0 && !loading && (
                    <p className="text-center text-error">No Task Was Found</p>
                )}
                {!loading && tasks.length > 0 && (
                    <div className="flex h-full flex-col gap-4 overflow-hidden text-bgColor">
                        <TasksList
                            tasks={filterTasks(tasks, false)}
                            loading={tasksFetch}
                            setLoading={setTasksFetch}
                            events={events}
                            users={users}
                        />
                        <TasksList
                            tasks={filterTasks(tasks, true)}
                            loading={tasksFetch}
                            setLoading={setTasksFetch}
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
