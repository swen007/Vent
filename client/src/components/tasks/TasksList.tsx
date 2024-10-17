/* eslint-disable @typescript-eslint/no-explicit-any */
import { Done, Edit, Undo, Visibility } from "@mui/icons-material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridTreeNodeWithRender,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { FetchedEvent, FetchedTask, UserDetails } from "../../types";
// import { DeleteSite, EditSite } from ".";
import { Typography } from "@mui/material";
import axios from "axios";
import { TaskComments, EditTask } from ".";
import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import { getElementByUid } from "../../utils";

export const TasksList = ({
    tasks,
    loading,
    setLoading,
    users,
    events,
    complete,
}: {
    tasks: FetchedTask[];
    events: FetchedEvent[];
    loading: boolean;
    setLoading: (arg0: boolean) => void;
    users: UserDetails[];
    complete?: boolean;
}) => {
    const [editTask, setEditTask] = useState<boolean>(false);
    const [viewTask, setViewTask] = useState<boolean>(false);
    const [, setEditKey] = useState<string>("");
    const [viewKey, setViewKey] = useState<string>("");
    const [task, setTask] = useState<FetchedTask | null>(null);

    const authContext = useContext(AuthContext)!;
    const { showMessage } = useContext(MessageContext)!;

    const getDetailsFromParams = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
    ) => {
        return tasks.filter((task) => task.uid === params.row.id).at(0);
    };

    const valueGetter = (key: string) => {
        return (params: GridValueGetterParams) => {
            const temp = getDetailsFromParams(params);
            if (key === "done") {
                return temp?.done ? "Complete" : "Incomplete";
            }
            return temp?.[key as keyof FetchedTask] || "NA";
        };
    };

    const eventNameGetter = (key: string) => {
        return (parmas: GridValueGetterParams) => {
            const temp = getDetailsFromParams(parmas);
            const uid = temp?.[key as keyof FetchedTask];
            if (!uid) return "NA";
            const event = getElementByUid(events, uid as string);
            return event?.name || "NA";
        };
    };

    const userEmailValueGetter = (key: string) => {
        return (parmas: GridValueGetterParams) => {
            const temp = getDetailsFromParams(parmas);
            const uid = temp?.[key as keyof FetchedTask];
            if (!uid) return "NA";
            const user = getElementByUid(users, uid as string);
            return `${user?.email} - ${user?.role.roleName}` || "NA";
        };
    };

    const handleDone = (key: string) => {
        return () => {
            const tempTask = tasks.filter((task) => task.uid === key).at(0)!;
            setLoading(true);
            axios
                .get(
                    `${BACKEND_URI}/task/${
                        !complete ? "done" : "undo"
                    }?uid=${tempTask?.uid}`,
                    {
                        headers: authContext.headers,
                    }
                )
                .then(() => {
                    showMessage(
                        `The task was marked as ${
                            complete ? "undone" : "done"
                        }.`,
                        "success"
                    );
                })
                .catch(() => {
                    showMessage("There was an error.", "error");
                })
                .finally(() => {
                    setLoading(false);
                });
        };
    };

    const handleView = (key: string) => {
        return () => {
            setViewKey(key);
            setViewTask(true);
            const tempTask = tasks.filter((task) => task.uid === key).at(0)!;
            setTask(tempTask);
        };
    };

    const handleEdit = (key: string) => {
        return () => {
            setEditKey(key);
            setEditTask(true);
            const tempTask = tasks.filter((task) => task.uid === key).at(0)!;
            setTask(tempTask);
        };
    };

    const columns: GridColDef[] = [
        {
            field: "action",
            headerName: "Actions",
            type: "actions",
            sortable: false,
            width: 85,
            align: "center",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        onClick={handleEdit(id as string)}
                        className="text-bgColor"
                    />,
                    complete ? (
                        <GridActionsCellItem
                            icon={<Undo />}
                            label="Done"
                            onClick={handleDone(id as string)}
                            className="text-bgColor"
                        />
                    ) : (
                        <GridActionsCellItem
                            icon={<Done />}
                            label="Undo"
                            onClick={handleDone(id as string)}
                            className="text-bgColor"
                        />
                    ),
                ];
            },
        },
        {
            field: "name",
            headerName: "Name",
            valueGetter: valueGetter("name"),
            flex: 2,
            align: "left",
        },
        {
            field: "desc",
            headerName: "Description",
            valueGetter: valueGetter("desc"),
            flex: 4,
            align: "left",
        },
        {
            field: "projectId",
            headerName: "Event",
            valueGetter: eventNameGetter("projectId"),
            flex: 2,
            align: "left",
        },
        {
            field: "assignedTo",
            headerName: "Assigned",
            valueGetter: userEmailValueGetter("assignedTo"),
            flex: 3,
            align: "left",
        },
        {
            field: "userId",
            headerName: "Created By",
            valueGetter: userEmailValueGetter("userId"),
            flex: 3,
            align: "left",
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            valueGetter: valueGetter("dueDate"),
            flex: 2,
            align: "left",
        },
        {
            field: "view",
            headerName: "View",
            type: "actions",
            sortable: false,
            width: 60,
            align: "center",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Visibility />}
                        label="View"
                        onClick={handleView(id as string)}
                        className="text-bgColor"
                    />,
                ];
            },
        },
    ];

    return (
        <div className="flex h-1/2 flex-col justify-between">
            <Typography
                variant="h3"
                className="text-center text-2xl uppercase tracking-widest"
            >
                {complete ? "Completed" : "Incomplete"} Tasks
            </Typography>
            {editTask && task !== null && (
                <EditTask
                    loading={loading}
                    setLoading={setLoading}
                    editTask={editTask}
                    handleClose={() => setEditTask(false)}
                    users={users}
                    events={events}
                    task={task!}
                />
            )}
            <TaskComments
                deleteTask={viewTask}
                handleClose={() => setViewTask(false)}
                task={tasks.filter((task) => task.uid === viewKey).at(0)}
                loading={loading}
                setLoading={setLoading}
                users={users}
            />
            <DataGrid
                rows={tasks.map((task) => {
                    return { ...tasks, id: task.uid };
                })}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5]}
                className="h-[92%] text-bgColor"
            />
        </div>
    );
};
