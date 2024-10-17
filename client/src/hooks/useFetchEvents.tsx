import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BACKEND_URI } from "../constants";
import { AuthContext } from "../contexts";
import { FetchedEvent } from "../types";

export const useFetchEvents = ({
    eventsFetch,
    setLoading,
}: {
    eventsFetch?: boolean;
    setLoading(arg0: boolean): void;
}) => {
    const authContext = useContext(AuthContext)!;
    const [events, setEvents] = useState<FetchedEvent[]>([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URI}/event`, {
                headers: authContext.headers,
            })
            .then((resp) => {
                setEvents(resp.data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [authContext.headers, eventsFetch, setLoading]);

    return events;
};
