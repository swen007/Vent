/* eslint-disable @typescript-eslint/no-explicit-any */
import { Done, Undo, Visibility } from "@mui/icons-material";
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
import axios from "axios";
import { BACKEND_URI } from "../../constants";
import { AuthContext, MessageContext } from "../../contexts";
import { getElementByUid } from "../../utils";
import { Typography } from "@mui/material";
import { TaskComments } from ".";

export const AssignedList = ({
    tasks,
    events,
    complete,
    users,
}: {
    tasks: FetchedTask[];
    events: FetchedEvent[];
    users: UserDetails[];
    complete?: boolean;
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [viewTask, setViewTask] = useState<boolean>(false);
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

    const userEmailValueGetter = (key: string) => {
        return (parmas: GridValueGetterParams) => {
            const temp = getDetailsFromParams(parmas);
            const uid = temp?.[key as keyof FetchedTask];
            if (!uid) return "NA";
            const user = getElementByUid(users, uid as string);
            return `${user?.email} - ${user?.role.roleName}` || "NA";
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

    const handleDone = (key: string) => {
        return () => {
            const tempTask = tasks.filter((task) => task.uid === key).at(0)!;
            axios
                .get(`${BACKEND_URI}/task/done?uid=${tempTask?.uid}`, {
                    headers: authContext.headers,
                })
                .then(() => {
                    showMessage("The task was marked as done.", "success");
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

    const handleUndone = (key: string) => {
        return () => {
            const tempTask = tasks.filter((task) => task.uid === key).at(0)!;
            axios
                .get(`${BACKEND_URI}/task/undo?uid=${tempTask?.uid}`, {
                    headers: authContext.headers,
                })
                .then(() => {
                    showMessage("The task was marked as done.", "success");
                })
                .catch(() => {
                    showMessage("There was an error.", "error");
                })
                .finally(() => {
                    setLoading(false);
                });
        };
    };

    const columns: GridColDef[] = [
        {
            field: "action",
            headerName: "Action",
            type: "actions",
            sortable: false,
            width: 70,
            align: "center",
            getActions: ({ id }) => {
                const tempTask = tasks.filter((task) => task.uid === id).at(0)!;
                if (tempTask.done) {
                    return [
                        <GridActionsCellItem
                            icon={<Undo />}
                            label="Mark as Undone"
                            onClick={handleUndone(id as string)}
                            className="text-bgColor"
                            disabled={loading}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<Done />}
                        label="Mark as Done"
                        onClick={handleDone(id as string)}
                        className="text-bgColor"
                        disabled={loading}
                    />,
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
            field: "status",
            headerName: "Status",
            valueGetter: valueGetter("done"),
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
            field: "dueDate",
            headerName: "Due Date",
            valueGetter: valueGetter("dueDate"),
            flex: 2,
            align: "left",
        },
        {
            field: "createdBy",
            headerName: "Task Created By",
            valueGetter: userEmailValueGetter("userId"),
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
