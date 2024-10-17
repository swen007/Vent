import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BACKEND_URI } from "../constants";
import { AuthContext } from "../contexts";
import { FetchedTask } from "../types";

export const useFetchTasks = ({
    tasksFetch,
    setLoading,
}: {
    tasksFetch?: boolean;
    setLoading(arg0: boolean): void;
}) => {
    const authContext = useContext(AuthContext)!;
    const [tasks, setTasks] = useState<FetchedTask[]>([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URI}/task`, {
                headers: authContext.headers,
            })
            .then((resp) => {
                setTasks(resp.data);
                console.log(resp.data);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [authContext.headers, tasksFetch, setLoading]);

    return tasks;
};
