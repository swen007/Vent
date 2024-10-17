import { useState } from "react";
import { CreateEvent, EventsList, ImageBg } from "../components";
import { useFetchEvents, useFetchUsers } from "../hooks";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";

export const EventsPage = () => {
    const [eventsLoading, setEventsLoading] = useState<boolean>(true);
    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const [eventsFetch, setEventsFetch] = useState<boolean>(false);
    const [addEvent, setAddEvent] = useState<boolean>(false);

    const events = useFetchEvents({
        eventsFetch,
        setLoading: setEventsLoading,
    });
    const users = useFetchUsers({
        setLoading: setUsersLoading,
    });

    const loading = eventsLoading || usersLoading;

    return (
        <div className="relative ml-[200px] flex h-full w-[calc(100%-200px)] flex-col items-center justify-center bg-bgColor">
            <ImageBg />
            <div className="z-10 flex h-[90%] w-11/12 flex-col rounded-md bg-textColor p-4 text-bgColor">
                <Typography variant="h4" className="text-center">
                    Event Management
                </Typography>
                <Divider className="my-4" />
                <div className="mb-4 flex w-full justify-end">
                    <Button
                        disabled={loading}
                        variant="contained"
                        color="secondary"
                        onClick={() => setAddEvent(true)}
                    >
                        Add New Event
                    </Button>
                </div>
                <CreateEvent
                    loading={eventsFetch}
                    setLoading={setEventsFetch}
                    addEvent={addEvent}
                    handleClose={() => setAddEvent(false)}
                />
                {loading && (
                    <div className="flex justify-center">
                        <CircularProgress color="secondary" />
                    </div>
                )}
                {events.length === 0 && !loading && (
                    <p className="text-center text-error">No Event Was Found</p>
                )}
                {!loading && events.length > 0 && (
                    <div className="h-full text-bgColor">
                        <EventsList
                            events={events}
                            loading={eventsFetch}
                            setLoading={setEventsFetch}
                            users={users}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
