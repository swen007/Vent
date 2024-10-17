import { FetchedTask } from "../types";

export const filterTasks = (tasks: FetchedTask[], complete = true) => {
    return tasks.filter((task) => task.done === complete);
};
