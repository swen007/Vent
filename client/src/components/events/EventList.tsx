import { Delete, Edit } from "@mui/icons-material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
    GridTreeNodeWithRender,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { DeleteEvent, EditEvent } from ".";
import { FetchedEvent, FetchedTask, UserDetails } from "../../types";
import { getElementByUid } from "../../utils";
import { AuthContext } from "../../contexts";
// import { DeleteSite, EditSite } from ".";
// import { getUserByUid } from "../../utils";
export const EventsList = ({
    events,
    loading,
    setLoading,
    users,
}: {
    events: FetchedEvent[];
    loading: boolean;
    setLoading: (arg0: boolean) => void;
    users: UserDetails[];
}) => {
    const [editEvent, setEditEvent] = useState<boolean>(false);
    const [deleteSite, setDeleteSite] = useState<boolean>(false);
    const [, setEditKey] = useState<string>("");
    const [deleteKey, setDeleteKey] = useState<string>("");
    const [event, setEvent] = useState<FetchedEvent | null>(null);

    const authContext = useContext(AuthContext)!;

    const getDetailsFromParams = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
    ) => {
        return events.filter((site) => site.uid === params.row.id).at(0);
    };

    const valueGetter = (key: string) => {
        return (params: GridValueGetterParams) => {
            const temp = getDetailsFromParams(params);
            if (key === "done") {
                return temp?.done ? "Complete" : "Incomplete";
            }
            return temp?.[key as keyof FetchedEvent] || "NA";
        };
    };

    const userEmailValueGetter = (key: string) => {
        return (parmas: GridValueGetterParams) => {
            const temp = getDetailsFromParams(parmas);
            const uid = temp?.[key as keyof FetchedEvent];
            if (!uid) return "NA";
            const user = getElementByUid(users, uid as string);
            return `${user?.email} - ${user?.role.roleName}` || "NA";
        };
    };

    const handleDelete = (key: string) => {
        return () => {
            setDeleteKey(key);
            setDeleteSite(true);
        };
    };

    const handleEdit = (key: string) => {
        return () => {
            setEditKey(key);
            setEditEvent(true);
            const tempSite = events.filter((site) => site.uid === key).at(0)!;
            setEvent(tempSite);
        };
    };

    const columns: GridColDef[] = [
        {
            field: "action",
            headerName: "Actions",
            type: "actions",
            sortable: false,
            width: 100,
            align: "left",
            getActions: ({ id }) => {
                const event = events.filter((site) => site.uid === id).at(0);
                const createdBy = getElementByUid(
                    users,
                    event!.createdBy as string
                );

                if (
                    authContext.userDetails!.role.accessLevel >=
                    createdBy.role.accessLevel
                ) {
                    return [
                        <GridActionsCellItem
                            icon={<Edit />}
                            label="Edit"
                            onClick={handleEdit(id as string)}
                            className="text-bgColor"
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={handleDelete(id as string)}
                            className="text-bgColor"
                        />,
                    ];
                } else {
                    return [<p className="w-full text-center">Unauthorized</p>];
                }
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
            field: "createdBy",
            headerName: "Created By",
            valueGetter: userEmailValueGetter("createdBy"),
            flex: 2,
            align: "left",
        },
    ];

    return (
        <>
            {editEvent && event !== null && (
                <EditEvent
                    loading={loading}
                    setLoading={setLoading}
                    editEvent={editEvent}
                    handleClose={() => setEditEvent(false)}
                    event={event!}
                />
            )}
            <DeleteEvent
                deleteEvent={deleteSite}
                handleClose={() => setDeleteSite(false)}
                event={events.filter((site) => site.uid === deleteKey).at(0)}
                loading={loading}
                setLoading={setLoading}
            />
            <DataGrid
                rows={events.map((user) => {
                    return { ...events, id: user.uid };
                })}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5]}
                className="text-bgColor"
            />
        </>
    );
};
